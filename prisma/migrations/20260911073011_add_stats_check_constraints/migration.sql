ALTER TABLE "stats"
ADD CONSTRAINT "stats_p3_a_check"
CHECK ("p3_a" >= 0),

ADD CONSTRAINT "stats_p3_m_check"
CHECK ("p3_m" >= 0),

ADD CONSTRAINT "stats_p2_a_check"
CHECK ("p2_a" >= 0),

ADD CONSTRAINT "stats_p2_m_check"
CHECK ("p2_m" >= 0),

ADD CONSTRAINT "stats_ft_a_check"
CHECK ("ft_a" >= 0),

ADD CONSTRAINT "stats_ft_m_check"
CHECK ("ft_m" >= 0),

ADD CONSTRAINT "stats_o_rbd_check"
CHECK ("o_rbd" >= 0),

ADD CONSTRAINT "stats_d_rbd_check"
CHECK ("d_rbd" >= 0),

ADD CONSTRAINT "stats_ast_check"
CHECK ("ast" >= 0),

ADD CONSTRAINT "stats_stl_check"
CHECK ("stl" >= 0),

ADD CONSTRAINT "stats_blk_check"
CHECK ("blk" >= 0),

ADD CONSTRAINT "stats_tov_check"
CHECK ("tov" >= 0),

ADD CONSTRAINT "stats_pf_check"
CHECK ("pf" >= 0),

ADD CONSTRAINT "stats_tf_check"
CHECK ("tf" >= 0),

ADD CONSTRAINT "stats_fo_check"
CHECK ("fo" >= 0),

ADD CONSTRAINT "stats_dq_check"
CHECK ("dq" BETWEEN 0 AND 1),

ADD CONSTRAINT "stats_play_sec_check"
CHECK ("play_sec" >= 0 AND "play_sec" <= 2400),

ADD CONSTRAINT "stats_p3_m_le_p3_a_check"
CHECK ("p3_m" <= "p3_a"),

ADD CONSTRAINT "stats_p2_m_le_p2_a_check"
CHECK ("p2_m" <= "p2_a"),

ADD CONSTRAINT "stats_ft_m_le_ft_a_check"
CHECK ("ft_m" <= "ft_a"),

ADD CONSTRAINT "stats_pf_max_check"
CHECK ("pf" <= 5),

ADD CONSTRAINT "stats_tf_max_check"
CHECK ("tf" <= 2),

ADD CONSTRAINT "stats_pf_tf_sum_check"
CHECK ("pf" + "tf" <= 5);