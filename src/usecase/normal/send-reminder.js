const wrapper = require('../../lib/utils/wrapper');
const CSVHandler = require('../../lib/csv');
const sharedUc = require('./shared');

const getPresence = async (groupInfo) => {
  try {
    const filePath = await sharedUc.getFilePathPresence(groupInfo);
    if (filePath.err) return filePath;

    const csvHandler = new CSVHandler(filePath.data);
    const presenceData = await csvHandler.readAllRecords();
    if (presenceData.err) return presenceData;

    const usersPresent = [];
    presenceData.data.forEach((data) => {
      usersPresent.push(data.wa_number);
    });

    return wrapper.data(usersPresent);
  } catch (error) {
    return wrapper.error(error);
  }
};

const sendReminder = async (payload) => {
  try {
    const { client } = payload;
    const { chat } = payload;

    const filePathUserMaster = await sharedUc.getFilePathUserMaster(payload.groupInfo);
    if (!filePathUserMaster.err) {
      const presenceData = await getPresence(payload.groupInfo);
      if (presenceData.err) return presenceData;

      const usersPresent = presenceData.data;

      const mentions = [];

      const csvHandler = new CSVHandler(filePathUserMaster.data);
      const usersRecord = await csvHandler.readAllRecords();
      if (usersRecord.err) return usersRecord;

      let textMentionsUser = '';
      for (const participant of chat.participants) {
        const contact = await client.getContactById(participant.id._serialized);
        if (!usersPresent.includes(participant.id._serialized)) {
          const foundUser = usersRecord.data.filter((v) => v.wa_number === participant.id._serialized);
          if (foundUser.length) {
            mentions.push(contact);
            textMentionsUser += `@${participant.id.user} `;
          }
        }
      }

      const data = {
        mentions,
        textMentionsUser,
        usersPresent,
      };
      return wrapper.data(data);
    }

    return wrapper.error('file not found');
  } catch (error) {
    return wrapper.error(error);
  }
};

module.exports = sendReminder;
