module.exports = (sequelize, DataTypes) => {
	const token = sequelize.define(
		'token',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'user',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			app_user_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'app_user',
					key: 'id',
				},
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE',
			},
			expires_at: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			revoked: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: false,
			},
		},
		{
			tableName: 'token',
			timestamps: true,
		}
	);
	token.associate = (models) => {
		token.belongsTo(models.app_user, {
			foreignKey: 'app_user_id',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		});
		token.belongsTo(models.user, {
			foreignKey: 'user_id',
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		});
	};

	return token;
};
