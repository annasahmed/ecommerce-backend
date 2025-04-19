// model/info.js
const { baseAssociation, baseFields, baseScopes } = require('./base_model');

module.exports = (sequelize, DataTypes) => {
	const info = sequelize.define(
		'info',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			title: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			link: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'user',
					key: 'id',
				},
				onDelete: 'SET NULL',
				onUpdate: 'CASCADE',
			},
			...baseFields,
		},
		{
			tableName: 'info',
			timestamps: true,
			...baseScopes(),
		}
	);

	info.associate = (models) => {
		info.belongsTo(models.user, {
			foreignKey: 'user_id',
			onDelete: 'SET NULL',
			onUpdate: 'CASCADE',
		});
		baseAssociation(info, models);
	};

	return info;
};
