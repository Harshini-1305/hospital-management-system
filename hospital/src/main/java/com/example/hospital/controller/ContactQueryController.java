package com.example.hospital.controller;

import com.example.hospital.entity.ContactQuery;
import com.example.hospital.repository.ContactQueryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/queries")
@CrossOrigin(origins = "*")
public class ContactQueryController {

    private final ContactQueryRepository repo;

    public ContactQueryController(ContactQueryRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public ContactQuery create(@RequestBody ContactQuery query) {
        return repo.save(query);
    }

    @GetMapping
    public List<ContactQuery> getAll() {
        return repo.findAll();
    }
}
