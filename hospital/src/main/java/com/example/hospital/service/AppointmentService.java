package com.example.hospital.service;

import com.example.hospital.entity.*;
import com.example.hospital.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository repo;
    private final UserRepository userRepo;
    private final DoctorRepository doctorRepo;

    public AppointmentService(AppointmentRepository repo,
                              UserRepository userRepo,
                              DoctorRepository doctorRepo) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.doctorRepo = doctorRepo;
    }

    public Appointment book(Long patientId, Long doctorId, String date) {
        User patient = userRepo.findById(patientId).orElseThrow();
        Doctor doctor = doctorRepo.findById(doctorId).orElseThrow();

        Appointment appointment = new Appointment();
        appointment.setUser(patient);
        appointment.setDoctor(doctor);
        appointment.setDate(date);
        appointment.setStatus("PENDING");

        return repo.save(appointment);
    }

    public Appointment save(Appointment appointment) {
        return repo.save(appointment);
    }

    public List<Appointment> getAll() {
        return repo.findAll();
    }
}