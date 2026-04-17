'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('blogs', [
      {
        category: "Programming",
        title: "backend",
        description: "A beginner-friendly guide to understanding JavaScript with examples.",
        comments: 12,
        likes: 45,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('blogs', null, {});
  },
};