package com.example.hospital.repository;

import com.example.hospital.entity.ContactQuery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactQueryRepository extends JpaRepository<ContactQuery, Long> {
}
