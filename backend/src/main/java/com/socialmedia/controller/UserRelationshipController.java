package com.socialmedia.controller;

import com.socialmedia.dto.UserRelationshipDto;
import com.socialmedia.model.UserRelationship;
import com.socialmedia.service.UserRelationshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RequiredArgsConstructor
public class UserRelationshipController {
    private final UserRelationshipService relationshipService;

    @PostMapping("/{userId}/follow")
    public ResponseEntity<UserRelationshipDto.RelationshipStats> toggleFollow(
            @PathVariable Integer userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        relationshipService.toggleFollow(userDetails.getUsername(), userId);
        UserRelationshipDto.RelationshipStats stats =
                relationshipService.getRelationshipStats(userId, userDetails.getUsername());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{userId}/relationships")
    public ResponseEntity<UserRelationshipDto.RelationshipStats> getRelationshipStats(
            @PathVariable Integer userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        UserRelationshipDto.RelationshipStats stats =
                relationshipService.getRelationshipStats(userId, userDetails.getUsername());
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/{userId}/followers")
    public ResponseEntity<Page<UserRelationshipDto.UserSummary>> getFollowers(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<UserRelationshipDto.UserSummary> followers =
                relationshipService.getFollowers(userId, userDetails.getUsername(), pageRequest);
        return ResponseEntity.ok(followers);
    }

    @GetMapping("/{userId}/following")
    public ResponseEntity<Page<UserRelationshipDto.UserSummary>> getFollowing(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<UserRelationshipDto.UserSummary> following =
                relationshipService.getFollowing(userId, userDetails.getUsername(), pageRequest);
        return ResponseEntity.ok(following);
    }

    @GetMapping("/{userId}/relationship-status")
    public ResponseEntity<Map<String, Object>> getRelationshipStatus(
            @PathVariable Integer userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(relationshipService.getDetailedRelationshipStatus(userId, userDetails.getUsername()));
    }

    @PostMapping("/{userId}/block")
    public ResponseEntity<Map<String, String>> toggleBlock(
            @PathVariable Integer userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        relationshipService.toggleBlock(userDetails.getUsername(), userId);
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Block status toggled successfully"
        ));
    }

    @PostMapping("/{userId}/mute")
    public ResponseEntity<Map<String, String>> toggleMute(
            @PathVariable Integer userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        relationshipService.toggleMute(userDetails.getUsername(), userId);
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Mute status toggled successfully"
        ));
    }

    @PostMapping("/{userId}/close-friends")
    public ResponseEntity<Map<String, String>> toggleCloseFriend(
            @PathVariable Integer userId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        relationshipService.toggleCloseFriend(userDetails.getUsername(), userId);
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "message", "Close friend status toggled successfully"
        ));
    }
}