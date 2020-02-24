const sqlite3 = require('sqlite3').verbose()

class UserDB extends sqlite3.Database {
	constructor(dbPath) {
		super(dbPath)
		this.createTable()
	}
	createTable() {
		const sql =
			`CREATE TABLE IF NOT EXISTS playlists (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			playlist_id TEXT NOT NULL,
			owner TEXT NOT NULL,
			tracks TEXT NOT NULL,
			metadata TEXT NOT NULL
		)`
		this.run(sql)
	}
	savePlaylist(playlistID, userID, trackIDs, metadata) {
		let tracks = JSON.stringify(trackIDs)
		let sql = `INSERT INTO playlists(playlist_id, owner, tracks, metadata) VALUES(?,?,?,?)`
		return new Promise((resolve, reject) => {
			this.run(sql, [playlistID, userID, tracks, metadata], (err) => {
				if (err) {
					reject(err.message)
				}
				resolve()
			})
			this.close()
		})
	}
	deletePlaylist(playlistID) {
		let sql = `DELETE FROM playlists WHERE playlist_id = '${playlistID}'`
		return new Promise((resolve, reject) => {
			this.run(sql, [], (err) => {
				if (err) {
					reject(err)
				}
				resolve()
			})
			this.close()
		})
	}
	getCreatedPlaylists(userID) {
		let sql = `SELECT * FROM playlists WHERE owner = ?`
		return new Promise((resolve, reject) => {
			this.all(sql, [userID], (err, rows) => {
				if (err) {
					reject(err.message);
				}
				if (rows) {
					resolve(rows);
				} else {
					resolve(null)
				}
			});
			this.close()
		})
	}
	getNamedPlaylists(playlistIDs) {
		console.log(playlistIDs)
	}
	// updatePlaylists(userID, userPlaylists) {
	// 	let sql = `UPDATE users
	// 			SET user_playlists = ${userPlaylists}
	// 			WHERE user_id = ${userID}`;
	// 	return new Promise((resolve, reject) => {
	// 		this.run(sql, [], function (err) {
	// 			if (err) {
	// 				reject(err.message)
	// 			} else {
	// 				resolve('Done')
	// 			}
	// 		})
	// 		this.close()
	// 	})
	// }
}

module.exports = UserDB
