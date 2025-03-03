export type Event2 = {
    id: number; // SERIAL -> number
    event_date: string; // date -> string (ISO date format)
    touchpoint_date: string; // date -> string (ISO date format)
    touchpoint_timestamp: string; // timestamp -> string (ISO datetime format)
    adjusted_timestamp: string; // timestamp -> string (ISO datetime format)
    device_id?: string; // varchar(80) -> string | null
    country?: string; // varchar(80) -> string | null
    game_package_name?: string; // varchar(80) -> string | null
    os_version?: string; // varchar(80) -> string | null
    app_version?: string; // varchar(80) -> string | null
    install_source?: string; // varchar(80) -> string | null
    campaign_id?: string; // varchar(80) -> string | null
    campaign_name?: string; // varchar(80) -> string | null
    total_converted_revenue: number; // float8 -> number
    banner_revenue: number; // float8 -> number
    reward_revenue: number; // float8 -> number
    inter_revenue: number; // float8 -> number
    mrec_revenue: number; // float8 -> number
    audio_revenue: number; // float8 -> number
    openad_revenue: number; // float8 -> number
    total_banner: number; // int4 -> number
    total_reward: number; // int4 -> number
    total_inter: number; // int4 -> number
    total_mrec: number; // int4 -> number
    total_audio: number; // int4 -> number
    total_openad: number; // int4 -> number
    tracking_name?: string; // varchar(80) -> string | null
    line_x1: number; // float8 -> number
    line_x2: number; // float8 -> number
    line_x3: number; // float8 -> number
    line_x4: number; // float8 -> number
    line_x5: number; // float8 -> number
    line_x6: number; // float8 -> number
    block_count: number; // float8 -> number
    drop_block_count: number; // float8 -> number
    mul_block_count: number; // float8 -> number
    single_block_count: number; // float8 -> number
    exp_lucky: number; // float8 -> number
    total_exp: number; // float8 -> number
    mul_exp: number; // float8 -> number
    section_exp: number; // float8 -> number
    single_exp: number; // float8 -> number
    length: number; // float8 -> number
    android_id?: string; // varchar(80) -> string | null
    merge_count: number; // float8 -> number
    banner_rev: number; // float8 -> number
    reward_rev: number; // float8 -> number
    inter_rev: number; // float8 -> number
    mrec_rev: number; // float8 -> number
    audio_rev: number; // float8 -> number
    openad_rev: number; // float8 -> number
    banner_count: number; // float8 -> number
    reward_count: number; // float8 -> number
    inter_count: number; // float8 -> number
    mrec_count: number; // float8 -> number
    audio_count: number; // float8 -> number
    openad_count: number; // float8 -> number
  }
  