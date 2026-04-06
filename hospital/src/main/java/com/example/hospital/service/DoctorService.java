package com.example.hospital.service;

import com.example.hospital.entity.Doctor;
import com.example.hospital.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository repo;

    public DoctorService(DoctorRepository repo) {
        this.repo = repo;
    }

    public Doctor addDoctor(Doctor doctor) {
        return repo.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return repo.findAll();
    }

    public void deleteByEmail(String email) {
        Doctor doctor = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found with email: " + email));
        repo.delete(doctor);
    }
}