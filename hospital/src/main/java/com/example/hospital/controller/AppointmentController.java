package com.example.hospital.controller;

import com.example.hospital.entity.Appointment;
import com.example.hospital.entity.User;
import com.example.hospital.entity.Doctor;
import com.example.hospital.entity.Role;
import com.example.hospital.repository.UserRepository;
import com.example.hospital.repository.DoctorRepository;
import com.example.hospital.repository.AppointmentRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentController(AppointmentRepository appointmentRepository, UserRepository userRepository, DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
    }

    @PostMapping
    public Appointment book(@RequestBody Appointment appointment) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new com.example.hospital.exception.UnauthorizedException("User not logged in");
        }
        
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new com.example.hospital.exception.UserNotFoundException("User not found"));
        
        if (appointment.getDoctor() == null || appointment.getDoctor().getId() == null) {
            throw new com.example.hospital.exception.AppointmentBookingException("Doctor not available");
        }
        if (appointment.getDate() == null || appointment.getDate().trim().isEmpty() || 
            appointment.getTime() == null || appointment.getTime().trim().isEmpty()) {
            throw new com.example.hospital.exception.AppointmentBookingException("Date/time missing");
        }
        
        Doctor doctor = doctorRepository.findById(appointment.getDoctor().getId())
                .orElseThrow(() -> new com.example.hospital.exception.ResourceNotFoundException("Doctor not found"));

        appointment.setUser(user);
        appointment.setDoctor(doctor);
        
        try {
            return appointmentRepository.save(appointment);
        } catch (Exception e) {
            throw new com.example.hospital.exception.AppointmentBookingException("Appointment booking failed");
        }
    }

    @GetMapping
    public List<Appointment> getRelevantAppointments() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == Role.ADMIN) {
            return appointmentRepository.findAll();
        } else if (user.getRole() == Role.DOCTOR) {
            Doctor doctor = doctorRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Doctor entity not found for active user email: " + email));
            return appointmentRepository.findByDoctor(doctor);
        }
        
        // Default to returning user's own appointments (Patient)
        return appointmentRepository.findByUser(user);
    }

    @GetMapping("/user/{id}")
    public List<Appointment> getAppointmentsByUserId(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return appointmentRepository.findByUser(user);
    }

    @PutMapping("/{id}/status")
    public Appointment updateStatus(@PathVariable Long id, @RequestBody String status) {
        Appointment app = appointmentRepository.findById(id).orElseThrow(() -> new RuntimeException("Appointment not found"));
        app.setStatus(status);
        return appointmentRepository.save(app);
    }
}