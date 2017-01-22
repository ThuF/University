/* globals $ */
/* eslint-env node, dirigible */

var database = require('db/database');
var datasource = database.getDatasource();
var gradesDaoExtensionsUtils = require('university/utils/gradesDaoExtensionUtils');

// Create an entity
exports.create = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'INSERT INTO GRADES (ID,STUDENT_ID,SUBJECT_ID,GRADE) VALUES (?,?,?,?)';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        var id = datasource.getSequence('GRADES_ID').next();
        statement.setInt(++i, id);
        statement.setShort(++i, entity.student_id);
        statement.setShort(++i, entity.subject_id);
        statement.setFloat(++i, entity.grade);
		gradesDaoExtensionsUtils.beforeCreate(connection, entity);
        statement.executeUpdate();
        gradesDaoExtensionsUtils.afterCreate(connection, entity);
    	return id;
    } finally {
        connection.close();
    }
};

// Return a single entity by Id
exports.get = function(id) {
	var entity = null;
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT * FROM GRADES WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setInt(1, id);

        var resultSet = statement.executeQuery();
        if (resultSet.next()) {
            entity = createEntity(resultSet);
        }
    } finally {
        connection.close();
    }
    return entity;
};

// Return all entities
exports.list = function(limit, offset, sort, desc) {
    var result = [];
    var connection = datasource.getConnection();
    try {
        var sql = 'SELECT ';
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genTopAndStart(limit, offset);
        }
        sql += ' * FROM GRADES';
        if (sort !== null) {
            sql += ' ORDER BY ' + sort;
        }
        if (sort !== null && desc !== null) {
            sql += ' DESC ';
        }
        if (limit !== null && offset !== null) {
            sql += ' ' + datasource.getPaging().genLimitAndOffset(limit, offset);
        }
        var statement = connection.prepareStatement(sql);
        var resultSet = statement.executeQuery();
        while (resultSet.next()) {
            result.push(createEntity(resultSet));
        }
    } finally {
        connection.close();
    }
    return result;
};

// Update an entity by Id
exports.update = function(entity) {
    var connection = datasource.getConnection();
    try {
        var sql = 'UPDATE GRADES SET   STUDENT_ID = ?, SUBJECT_ID = ?, GRADE = ? WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        var i = 0;
        statement.setShort(++i, entity.student_id);
        statement.setShort(++i, entity.subject_id);
        statement.setFloat(++i, entity.grade);
        statement.setInt(++i, entity.id);
		gradesDaoExtensionsUtils.beforeUpdate(connection, entity);
        statement.executeUpdate();
        gradesDaoExtensionsUtils.afterUpdate(connection, entity);
    } finally {
        connection.close();
    }
};

// Delete an entity
exports.delete = function(entity) {
    var connection = datasource.getConnection();
    try {
    	var sql = 'DELETE FROM GRADES WHERE ID = ?';
        var statement = connection.prepareStatement(sql);
        statement.setString(1, entity.id);
        gradesDaoExtensionsUtils.beforeDelete(connection, entity);
        statement.executeUpdate();
        gradesDaoExtensionsUtils.afterDelete(connection, entity);
    } finally {
        connection.close();
    }
};

// Return the entities count
exports.count = function() {
    var count = 0;
    var connection = datasource.getConnection();
    try {
    	var sql = 'SELECT COUNT(*) FROM GRADES';
        var statement = connection.prepareStatement(sql);
        var rs = statement.executeQuery();
        if (rs.next()) {
            count = rs.getInt(1);
        }
    } finally {
        connection.close();
    }
    return count;
};

// Returns the metadata for the entity
exports.metadata = function() {
	var metadata = {
		name: 'grades',
		type: 'object',
		properties: [
		{
			name: 'id',
			type: 'smallint',
			key: 'true',
			required: 'true'
		},
		{
			name: 'student_id',
			type: 'smallint'
		},
		{
			name: 'subject_id',
			type: 'smallint'
		},
		{
			name: 'grade',
			type: 'float'
		},
		]
	};
	return metadata;
};

// Create an entity as JSON object from ResultSet current Row
function createEntity(resultSet) {
    var result = {};
    result.id = resultSet.getShort('ID');
    result.student_id = resultSet.getShort('STUDENT_ID');
    result.subject_id = resultSet.getShort('SUBJECT_ID');
    result.grade = resultSet.getFloat('GRADE');
    return result;
}

