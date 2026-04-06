package com.example.hospital.config;

import com.example.hospital.entity.*;
import com.example.hospital.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, DoctorRepository doctorRepository, AppointmentRepository appointmentRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            
            // 1. Create ADMIN
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("Portal");
            admin.setGender("Male");
            admin.setContact("9999999999");
            admin.setEmail("admin@hospital.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);

            // 2. Create PATIENTS (matching screenshots)
            User p1 = createUser("Kishan", "Lal", "kishansmart0@gmail.com", "Male", "8838489464", "patient123", Role.PATIENT);
            User p2 = createUser("Tom", "Hanks", "tom@gmail.com", "Male", "9372625483", "patient123", Role.PATIENT);
            User p3 = createUser("Brad", "Pitt", "brad@gmail.com", "Male", "9528452845", "patient123", Role.PATIENT);

            // 3. Create DOCTORS
            createDoctorSet("Dinesh", "Karthik", "doctor1@hospital.com", "8877665544", "General", 700);
            createDoctorSet("Sarah", "Wilson", "doctor2@hospital.com", "8866554433", "Cardiology", 900);
            createDoctorSet("James", "Brown", "doctor3@hospital.com", "8855443322", "Neurology", 1200);

            // 4. Create SAMPLE APPOINTMENTS (matching screenshots)
            Doctor d1 = doctorRepository.findByEmail("doctor1@hospital.com").get();
            
            // Appointment 1: Cancelled by Patient
            createAppointment(p1, d1, "2020-02-28", "10:00:00", 700, "Cancelled by Patient");
            
            // Appointment 2: Active
            createAppointment(p1, d1, "2020-02-28", "12:00:00", 700, "Active");

            // Appointment 3: Active with Prescriptions
            Appointment a3 = createAppointment(p3, d1, "2020-03-25", "10:00:00", 700, "Active");
            a3.setDisease("Cold");
            a3.setAllergies("Nothing");
            a3.setPrescription("Take some rest");
            appointmentRepository.save(a3);

            System.out.println("✅ Robust Design-Matched Data Seeding Complete!");
        }
    }

    private User createUser(String fn, String ln, String email, String gender, String contact, String pass, Role role) {
        User u = new User();
        u.setFirstName(fn);
        u.setLastName(ln);
        u.setEmail(email);
        u.setGender(gender);
        u.setContact(contact);
        u.setPassword(passwordEncoder.encode(pass));
        u.setRole(role);
        return userRepository.save(u);
    }

    private void createDoctorSet(String fn, String ln, String email, String contact, String specialization, int fees) {
        User u = createUser(fn, ln, email, "Male", contact, "doctor123", Role.DOCTOR);

        Doctor d = new Doctor();
        d.setName(fn + " " + ln);
        d.setEmail(email);
        d.setSpecialization(specialization);
        d.setFees(fees);
        doctorRepository.save(d);
    }

    private Appointment createAppointment(User u, Doctor d, String date, String time, int fees, String status) {
        Appointment a = new Appointment();
        a.setUser(u);
        a.setDoctor(d);
        a.setDate(date);
        a.setTime(time);
        a.setConsultancyFees(fees);
        a.setStatus(status);
        return appointmentRepository.save(a);
    }
}
