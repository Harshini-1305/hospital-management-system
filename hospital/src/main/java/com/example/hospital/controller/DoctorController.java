package com.example.hospital.controller;

import com.example.hospital.entity.Doctor;
import com.example.hospital.service.DoctorService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService service;

    public DoctorController(DoctorService service) {
        this.service = service;
    }

    @PostMapping
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        return service.addDoctor(doctor);
    }

    @GetMapping
    public List<Doctor> getDoctors() {
        return service.getAllDoctors();
    }

    @DeleteMapping("/by-email")
    public void deleteByEmail(@RequestParam String email) {
        service.deleteByEmail(email);
    }
}