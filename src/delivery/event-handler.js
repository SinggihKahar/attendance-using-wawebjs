const usecase = require('../usecase');
const timeUtils = require('../lib/utils/time');
const logger = require('../lib/logger');
const constants = require('../lib/utils/constants');
const config = require('../../config');
const minSleepmsHandleBlasting = config.get('/minSleepmsHandleBlasting')
  ? config.get('/minSleepmsHandleBlasting')
  : 500; 
const maxSleepmsHandleBlasting = config.get('/maxSleepmsHandleBlasting')
  ? config.get('/maxSleepmsHandleBlasting')
  : 1500;

const onMessage = async (client) => {
  client.on('message', async (msg) => {
    try {
      const chat = await msg.getChat();
      if (chat.isGroup) {
        const msgBody = msg.body;
        if (typeof msgBody === 'string') {
          const groupInfo = {
            id: chat.id._serialized,
            id2: msg.from,
            name: chat.name,
          };
          const userInfo = {
            id: msg.author,
            name: '',
            npm: '',
          };

          if (msgBody.startsWith('.daftar ')) {
            logger.info(`Processing: ${msgBody}`);
            const res = await usecase.createUser({ msg, groupInfo, userInfo });
            if (!res.err) {
              await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
              await msg.reply(res.data);
            } else {
              logger.error(res.err);
            }
            logger.info(`Processed: ${msgBody}`);
          }

          if (msgBody === '.presensi') {
            logger.info(`Processing: ${msgBody}`);
            const res = await usecase.createPresence({ groupInfo, userInfo });
            if (!res.err) {
              await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
              await msg.reply(res.data);
            } else {
              logger.error(res.err);
            }
            logger.info(`Processed: ${msgBody}`);
          }

          if (msgBody === '.peserta') {
            logger.info(`Processing: ${msgBody}`);
            const res = await usecase.getParticipants({ groupInfo, userInfo });
            if (!res.err) {
              await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
              await msg.reply(res.data);
            } else {
              logger.error(res.err);
            }
            logger.info(`Processed: ${msgBody}`);
          }

          if (msgBody === '.help') {
            await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
            await msg.reply(constants.HELP_MESSAGE);
          }

          if (msgBody === '.reminder') {
            logger.info(`Processing: ${msgBody}`);
            const res = await usecase.sendReminder({
              groupInfo, userInfo, client, chat,
            });

            if (!res.err) {
              if (res.data.textMentionsUser !== '') {
                const reminder = '🤖 Reminder: Jangan lupa untuk melakukan presensi hari ini! ⏰';
                await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
                await chat.sendMessage(reminder);

                await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
                await chat.sendMessage(res.data.textMentionsUser, {
                  mentions: res.data.mentions,
                });
              }
            } else {
              logger.error(res.err);
            }
            logger.info(`Processed: ${msgBody}`);
          }

          if (msgBody === '.kehadiran') {
            logger.info(`Processing: ${msgBody}`);
            const res = await usecase.getPresence(groupInfo);
            if (!res.err) {
              await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
              await msg.reply(res.data);
            } else {
              logger.error(res.err);
            }
            logger.info(`Processed: ${msgBody}`);
          }
        }
      }
    } catch (error) {
      logger.error(error);
    }
  });
};

const onMessageCreate = async (client) => {
  client.on('message_create', async (msg) => {
    try {
      if (msg.fromMe) {
        const chat = await msg.getChat();
        if (chat.isGroup) {
          const msgBody = msg.body;
          if (typeof msgBody === 'string') {
            const groupInfo = {
              id: chat.id._serialized,
              id2: msg.from,
              name: chat.name,
            };
            const userInfo = {
              id: msg.author,
              name: '',
              npm: '',
            };

            if (msgBody.startsWith('.daftar ')) {
              logger.info(`Processing: ${msgBody}`);
              const res = await usecase.createUser({ msg, groupInfo, userInfo });
              if (!res.err) {
                await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
                await msg.reply(res.data);
              } else {
                logger.error(res.err);
              }
              logger.info(`Processed: ${msgBody}`);
            }

            if (msgBody === '.presensi') {
              logger.info(`Processing: ${msgBody}`);
              const res = await usecase.createPresence({ groupInfo, userInfo });
              if (!res.err) {
                await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
                await msg.reply(res.data);
              } else {
                logger.error(res.err);
              }
              logger.info(`Processed: ${msgBody}`);
            }

            if (msgBody === '.peserta') {
              logger.info(`Processing: ${msgBody}`);
              const res = await usecase.getParticipants({ groupInfo, userInfo });
              if (!res.err) {
                await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
                await msg.reply(res.data);
              } else {
                logger.error(res.err);
              }
              logger.info(`Processed: ${msgBody}`);
            }

            if (msgBody === '.help') {
              await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
              await msg.reply(constants.HELP_MESSAGE);
            }

            if (msgBody === '.reminder') {
              logger.info(`Processing: ${msgBody}`);
              const res = await usecase.sendReminder({
                groupInfo, userInfo, client, chat,
              });

              if (!res.err) {
                if (res.data.textMentionsUser !== '') {
                  const reminder = '🤖 Reminder: Jangan lupa untuk melakukan presensi hari ini! ⏰';
                  await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
                  await chat.sendMessage(reminder);

                  await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
                  await chat.sendMessage(res.data.textMentionsUser, {
                    mentions: res.data.mentions,
                  });
                }
              } else {
                logger.error(res.err);
              }
              logger.info(`Processed: ${msgBody}`);
            }

            if (msgBody === '.kehadiran') {
              logger.info(`Processing: ${msgBody}`);
              const res = await usecase.getPresence(groupInfo);
              if (!res.err) {
                await timeUtils.sleepRandom(minSleepmsHandleBlasting, maxSleepmsHandleBlasting);
                await msg.reply(res.data);
              } else {
                logger.error(res.err);
              }
              logger.info(`Processed: ${msgBody}`);
            }
          }
        }
      }
    } catch (error) {
      logger.error(error);
    }
  });
};

module.exports = {
  onMessage,
  onMessageCreate,
};
