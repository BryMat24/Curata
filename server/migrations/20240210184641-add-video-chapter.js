'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Chapters", "videoId", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Chapters", "videoThumbNail", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Chapters", "videoTitle", {
      type: Sequelize.STRING,
    });

    await queryInterface.addColumn("Chapters", "videoTranscript", {
      type: Sequelize.TEXT,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Chapters", "videoId");
    await queryInterface.removeColumn("Chapters", "videoThumbNail");
    await queryInterface.removeColumn("Chapters", "videoTitle");
    await queryInterface.removeColumn("Chapters", "videoTranscript");
  }
};
