const { Op, DataTypes } = require('sequelize');

const baseFields = {
	status: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		allowNull: false,
	},
	deleted_by: {
		type: DataTypes.INTEGER,
		allowNull: true,
		references: {
			model: 'user',
			key: 'id',
		},
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	},
	deleted_at: {
		type: DataTypes.DATE,
		allowNull: true,
	},
};

const baseScopes = (withPassword) => ({
	defaultScope: {
		...(!withPassword ? {} : { attributes: { exclude: ['password'] } }),
		where: {
			deleted_at: null,
			status: true,
		},
	},
	scopes: {
		withDeleted: {}, // returns everything
		withPassword: {
			attributes: {},
		},
		onlyDeleted: {
			where: {
				deleted_at: {
					[Op.ne]: null,
				},
			},
		},
		notDeleted: {
			where: {
				deleted_at: null,
			},
		},
		inactive: {
			where: {
				status: false,
			},
		},
	},
});

const baseAssociation = (modelName, models) => {
	modelName.belongsTo(models.user, {
		foreignKey: 'deleted_by',
		onDelete: 'SET NULL',
		onUpdate: 'CASCADE',
	});
};

// export const addSoftDelete = (model) => {
//     model.softDelete = async function (id, deletedByUserId) {
//         return await model.update(
//             { deleted_at: new Date(), deleted_by: deletedByUserId },
//             { where: { id } }
//         );
//     };
// };

module.exports = {
	baseAssociation,
	baseFields,
	baseScopes,
};
