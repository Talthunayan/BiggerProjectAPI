module.exports = (sequelize, DataTypes) => {
  const UserRooms = sequelize.define("UserRooms", {
    admin: {
      type: DataTypes.BOOLEAN,
    },
  });

  return UserRooms;
};
