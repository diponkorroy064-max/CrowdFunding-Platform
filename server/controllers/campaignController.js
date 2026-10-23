const { ObjectId } = require('mongodb');
const { getCollections } = require('../config/db');
const { createNotification } = require('../utils/notification');

// Public / Home: Top 6 Funded Campaigns
const getTopFundedCampaigns = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const topCampaigns = await campaignsCollection
      .find({ status: 'approved' })
      .sort({ amount_raised: -1 })
      .limit(6)
      .toArray();
    res.send(topCampaigns);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Supporter / Public: Explore campaigns with pagination
const getExploreCampaigns = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const { category, search, sort, page, limit } = req.query;
    const today = new Date().toISOString().split('T')[0];

    let query = {
      status: 'approved',
      deadline: { $gte: today }
    };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.campaign_title = { $regex: search, $options: 'i' };
    }

    let sortOptions = { createdAt: -1 };
    if (sort === 'raised-desc') sortOptions = { amount_raised: -1 };
    if (sort === 'raised-asc') sortOptions = { amount_raised: 1 };
    if (sort === 'deadline') sortOptions = { deadline: 1 };

    const total = await campaignsCollection.countDocuments(query);

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 6);
    const skip = (pageNum - 1) * limitNum;
    const totalPages = Math.ceil(total / limitNum) || 1;

    const campaigns = await campaignsCollection
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    res.send({
      campaigns,
      total,
      page: pageNum,
      totalPages,
      limit: limitNum
    });
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Get single campaign details
const getCampaignById = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const { id } = req.params;
    const campaign = await campaignsCollection.findOne({ _id: new ObjectId(id) });
    if (!campaign) {
      return res.status(404).send({ message: 'Campaign not found' });
    }
    res.send(campaign);
  } catch (err) {
    res.status(400).send({ message: 'Invalid campaign ID' });
  }
};

// Creator: Add new campaign (status: 'pending')
const createCampaign = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const campaignData = req.body;
    const newCampaign = {
      campaign_title: campaignData.campaign_title,
      campaign_story: campaignData.campaign_story,
      category: campaignData.category,
      funding_goal: Number(campaignData.funding_goal),
      minimum_Contribution: Number(campaignData.minimum_Contribution || 1),
      deadline: campaignData.deadline,
      reward_info: campaignData.reward_info,
      campaign_image_url: campaignData.campaign_image_url,
      creator_name: campaignData.creator_name,
      creator_email: campaignData.creator_email?.toLowerCase(),
      amount_raised: 0,
      status: 'pending',
      createdAt: new Date()
    };

    const result = await campaignsCollection.insertOne(newCampaign);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Creator: Get my campaigns
const getCreatorCampaigns = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const email = req.params.email?.toLowerCase();
    if (req.decoded?.email?.toLowerCase() !== email) {
      return res.status(403).send({ message: 'Forbidden' });
    }
    const campaigns = await campaignsCollection
      .find({ creator_email: email })
      .sort({ deadline: -1 })
      .toArray();
    res.send(campaigns);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Creator: Update campaign
const updateCampaign = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const { id } = req.params;
    const { campaign_title, campaign_story, reward_info } = req.body;
    const filter = { _id: new ObjectId(id) };
    const updatedDoc = {
      $set: {
        campaign_title,
        campaign_story,
        reward_info,
        updatedAt: new Date()
      }
    };
    const result = await campaignsCollection.updateOne(filter, updatedDoc);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Creator: Delete campaign (Refund all approved supporters of that campaign their contributions credits!)
const deleteCampaign = async (req, res) => {
  try {
    const { campaignsCollection, contributionsCollection, usersCollection } = getCollections();
    const { id } = req.params;
    const campaignFilter = { _id: new ObjectId(id) };

    // Find all approved contributions for this campaign to refund
    const approvedContributions = await contributionsCollection.find({
      campaign_id: id,
      status: 'approved'
    }).toArray();

    // Refund each supporter
    for (const contrib of approvedContributions) {
      await usersCollection.updateOne(
        { email: contrib.Supporter_email?.toLowerCase() },
        { $inc: { credits: Number(contrib.Contribution_amount) } }
      );

      // Notify supporter of refund
      await createNotification({
        message: `Campaign "${contrib.campaign_title}" was deleted. Your contribution of ${contrib.Contribution_amount} credits has been refunded.`,
        toEmail: contrib.Supporter_email,
        actionRoute: "/dashboard/my-contributions"
      });
    }

    // Delete contributions associated with this campaign
    await contributionsCollection.deleteMany({ campaign_id: id });

    // Delete the campaign
    const result = await campaignsCollection.deleteOne(campaignFilter);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: Get all pending campaigns for approval
const getPendingCampaigns = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const pendingCampaigns = await campaignsCollection
      .find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .toArray();
    res.send(pendingCampaigns);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: Approve or Reject campaign
const updateCampaignStatus = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const { id } = req.params;
    const { status } = req.body; // 'approved' | 'rejected'
    const filter = { _id: new ObjectId(id) };
    const campaign = await campaignsCollection.findOne(filter);

    if (!campaign) {
      return res.status(404).send({ message: 'Campaign not found' });
    }

    const result = await campaignsCollection.updateOne(filter, {
      $set: { status, reviewedAt: new Date() }
    });

    // Notify the creator
    await createNotification({
      message: `Your campaign "${campaign.campaign_title}" was ${status} by Admin.`,
      toEmail: campaign.creator_email,
      actionRoute: "/dashboard/my-campaigns"
    });

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: Manage Campaigns (all campaigns list)
const getAdminCampaigns = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const allCampaigns = await campaignsCollection.find().sort({ createdAt: -1 }).toArray();
    res.send(allCampaigns);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: Delete campaign
const deleteAdminCampaign = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const { id } = req.params;
    const filter = { _id: new ObjectId(id) };
    const result = await campaignsCollection.deleteOne(filter);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

// Admin: Suspend reported campaign
const suspendCampaign = async (req, res) => {
  try {
    const { campaignsCollection } = getCollections();
    const { id } = req.params;
    const result = await campaignsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: 'suspended', suspendedAt: new Date() } }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: true, message: error.message });
  }
};

module.exports = {
  getTopFundedCampaigns,
  getExploreCampaigns,
  getCampaignById,
  createCampaign,
  getCreatorCampaigns,
  updateCampaign,
  deleteCampaign,
  getPendingCampaigns,
  updateCampaignStatus,
  getAdminCampaigns,
  deleteAdminCampaign,
  suspendCampaign
};
