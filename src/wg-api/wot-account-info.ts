declare module "WotAccountInfo" {
    export interface ApiResponse {
        status: "ok";
        meta: Meta;
        data: Record<string, PlayerData>;
    }

    export interface Meta {
        count: number;
    }

    export interface PlayerData {
        account_id: number;
        client_language: string;
        clan_id: number;
        created_at: number;
        global_rating: number;
        last_battle_time: number;
        logout_at: number;
        nickname: string;
        private: PrivateData;
        statistics: Statistics;
        updated_at: number;
    }

    export interface PrivateData {
        battle_life_time: number;
        ban_info: string | null;
        ban_time: number | null;
        bonds: number;
        credits: number;
        free_xp: number;
        gold: number;
        is_bound_to_phone: boolean;
        is_premium: boolean;
        premium_expires_at: number;
        restrictions: Restrictions;
    }

    export interface Restrictions {
        chat_ban_time: number | null;
    }

    export interface Statistics {
        all: BattleStats;
        clan: BattleStats;
        company: BattleStats;
        historical: BattleStats;
        regular_team: BattleStats;
        stronghold_defense: BattleStats;
        stronghold_skirmish: BattleStats;
        team: BattleStats;
        trees_cut: number;
        frags: Record<string, number>;
    }

    export interface BattleStats {
        avg_damage_assisted: number;
        avg_damage_assisted_radio: number;
        avg_damage_assisted_stun: number;
        avg_damage_assisted_track: number;
        avg_damage_blocked: number;
        battle_avg_xp: number;
        battles: number;
        battles_on_stunning_vehicles: number;
        capture_points: number;
        damage_dealt: number;
        damage_received: number;
        direct_hits_received: number;
        draws: number;
        dropped_capture_points: number;
        explosion_hits: number;
        explosion_hits_received: number;
        frags: number;
        hits: number;
        hits_percents: number;
        losses: number;
        max_damage: number;
        max_damage_tank_id: number | null;
        max_frags: number;
        max_frags_tank_id: number | null;
        max_xp: number;
        max_xp_tank_id: number | null;
        no_damage_direct_hits_received: number;
        piercings: number;
        piercings_received: number;
        radio_assisted_damage: number;
        shots: number;
        spotted: number;
        stun_assisted_damage: number;
        stun_number: number;
        survived_battles: number;
        tanking_factor: number;
        track_assisted_damage: number;
        wins: number;
    }
}
