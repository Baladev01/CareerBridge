package com.career.CareerBridge.repository;

import com.career.CareerBridge.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndPassword(String email, String password);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findUserByEmail(@Param("email") String email);
    
    @Modifying
    @Query("UPDATE User u SET u.isNewUser = false WHERE u.id = :userId")
    void markAsExistingUser(@Param("userId") Long userId);
    
    // Remove all points-related methods
}