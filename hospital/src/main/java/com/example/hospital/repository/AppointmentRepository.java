package com.example.hospital.repository;

import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.User;
import com.example.hospital.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUser(User user);
    List<Appointment> findByDoctor(Doctor doctor);
}