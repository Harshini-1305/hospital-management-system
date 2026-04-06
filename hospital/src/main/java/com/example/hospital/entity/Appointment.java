package com.example.hospital.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String date;
    private String time;
    private Integer consultancyFees;
    private String status;
    
    // Medical Details for Prescriptions
    private String disease;
    private String allergies;
    private String prescription;

    @ManyToOne
    private User user;

    @ManyToOne
    private Doctor doctor;
}