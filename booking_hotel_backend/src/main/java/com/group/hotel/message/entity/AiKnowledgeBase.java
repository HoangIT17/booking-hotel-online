package com.group.hotel.message.entity;

import com.group.hotel.user.entity.User;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "ai_knowledge_base")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AiKnowledgeBase {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id")
    private User admin;

    @Column(name = "question_pattern", columnDefinition = "TEXT")
    private String questionPattern;

    @Column(name = "answer_content", columnDefinition = "TEXT")
    private String answerContent;
}
