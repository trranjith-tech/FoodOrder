package com.fooddeliver.repository;
import com.fooddeliver.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    @Query("SELECT r FROM Restaurant r WHERE " +
           "(:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:cuisine IS NULL OR LOWER(r.cuisine) = LOWER(:cuisine)) AND " +
           "(:minRating IS NULL OR r.rating >= :minRating) AND " +
           "r.isOpen = true")
    List<Restaurant> findWithFilters(@Param("search") String search, @Param("cuisine") String cuisine, @Param("minRating") Double minRating);
    List<Restaurant> findByOwnerEmail(String ownerEmail);
    java.util.Optional<Restaurant> findFirstByOwnerEmail(String ownerEmail);
}