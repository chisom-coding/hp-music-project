const inviteUser = async (req, res) => {
  const {
    body: invitationBody,
    params: { shopId },
  } = req;
  const authUrl = 'https://url.to.auth.system.com/invitation';

  try {
    const { status, data: invitationResponse } = await axios.post(
      authUrl,
      invitationBody
    );

    if (status === 200) {
      return res
        .status(400)
        .json({ error: true, message: 'User already invited to this shop' });
    }

    if (status === 201) {
      const createdUser = await User.findOneAndUpdate(
        { authId: invitationResponse.authId },
        { authId: invitationResponse.authId, email: invitationBody.email },
        { upsert: true, new: true }
      );

      const shop = await Shop.findById(shopId);
      if (!shop) return res.status(404).json({ message: 'No shop found' });

      if (!shop.invitations.includes(invitationResponse.invitationId)) {
        shop.invitations.push(invitationResponse.invitationId);
      }

      if (!shop.users.includes(createdUser._id)) {
        shop.users.push(createdUser._id);
      }

      await shop.save();
      return res.status(200).json({ message: 'User invited successfully' });
    }

    return res
      .status(500)
      .json({ message: 'Unexpected response from auth system' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing invitation', error });
  }
};

module.exports = { inviteUser };
