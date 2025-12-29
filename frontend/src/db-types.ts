// Type definitions that mirror the SQL schema in `database/init.sql`.
// Each type is prefixed with `DB_` to make origin explicit.

export type DB_User = {
	user_id: number;
	username: string;
	email: string;
	password_hash: string;
	created_at: string | null; // TIMESTAMP
	privileges: number;
	is_deleted: boolean;
};

export type DB_Game_Type = {
	type_name: string;
	max_players: number;
	min_players: number;
};

export type DB_Game = {
	game_id: number;
	type_name: string;
	name: string;
	creation_date: string; // TIMESTAMP
	start_date: string | null; // DATETIME
	counts_towards_leaderboard: boolean;
	status: "Unstarted" | "Ongoing" | "Finished";
};

export type DB_Unstarted_Game = {
	game_id: number;
	invite_code: string | null;
	is_public: boolean;
};

export type DB_Ongoing_Game = {
	game_id: number;
	public_info: Record<string, any> | null; // JSON
	state: Record<string, any> | null; // JSON
	location_url: string | null;
	turn_end_date: string | null; // DATETIME
};

export type DB_Finished_Game = {
	game_id: number;
	finish_date: string; // DATETIME
	ended_early: boolean;
	results: Record<string, any> | null; // JSON
};

export type DB_Plays = {
	user_id: number;
	game_id: number;
	resigned: boolean;
	private_info: Record<string, any> | null; // JSON
	score: number;
	rank: number | null;
};

export type DB_Has_Stats_For = {
	user_id: number;
	type_name: string;
	wins: number;
	losses: number;
};

// Utility: a union of all DB types (optional)
export type DB_Row =
	| DB_User
	| DB_Game_Type
	| DB_Game
	| DB_Unstarted_Game
	| DB_Ongoing_Game
	| DB_Finished_Game
	| DB_Plays
	| DB_Has_Stats_For;

