package com.fooddeliver.config;

import com.fooddeliver.entity.*;
import com.fooddeliver.entity.enums.Role;
import com.fooddeliver.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final RestaurantRepository restaurantRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Initializing rich food delivery dataset...");

            // Demo user
            User user = User.builder()
                .name("Demo User")
                .email("demo@food.com")
                .phone("9876543210")
                .password(passwordEncoder.encode("Demo@123"))
                .role(Role.USER)
                .verified(true)
                .build();
            userRepository.save(user);

            // Categories
            categoryRepository.saveAll(List.of(
                Category.builder().name("Pizza").icon("🍕").imageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80").build(),
                Category.builder().name("Burgers").icon("🍔").imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80").build(),
                Category.builder().name("Biryani").icon("🍚").imageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80").build(),
                Category.builder().name("Chinese").icon("🥡").imageUrl("https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&q=80").build(),
                Category.builder().name("Sushi").icon("🍣").imageUrl("https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80").build(),
                Category.builder().name("Desserts").icon("🍰").imageUrl("https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80").build(),
                Category.builder().name("Mexican").icon("🌮").imageUrl("https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80").build(),
                Category.builder().name("Beverages").icon("🧋").imageUrl("https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&q=80").build()
            ));

            // 1. The Burger Factory
            Restaurant r1 = Restaurant.builder()
                .name("The Burger Factory").cuisine("American").rating(4.8).deliveryTimeMin(20).deliveryTimeMax(30)
                .deliveryFee(29.0).minOrder(149.0).address("12, MG Road, Indiranagar, Bangalore").city("Bangalore")
                .imageUrl("https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&q=80")
                .coverImageUrl("https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=80")
                .build();
            r1.setMenuItems(List.of(
                MenuItem.builder().restaurant(r1).name("Classic Smash Cheeseburger").description("Double smashed Angus beef patty, cheddar, secret burger sauce, caramelised onions").price(249.0).category("Burgers").isVeg(false).imageUrl("https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80").rating(4.9).preparationTime(15).build(),
                MenuItem.builder().restaurant(r1).name("Smokey BBQ Bacon Burger").description("Crispy bacon strip, onion rings, smoked cheddar, house hickory BBQ sauce").price(299.0).category("Burgers").isVeg(false).imageUrl("https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80").rating(4.8).preparationTime(15).build(),
                MenuItem.builder().restaurant(r1).name("Truffle Veggie Delight").description("Crispy mushroom & corn patty, black truffle mayo, fresh lettuce, brioche bun").price(199.0).category("Burgers").isVeg(true).imageUrl("https://images.unsplash.com/photo-1525059696034-4967a8e1dca2?w=500&q=80").rating(4.6).preparationTime(12).build(),
                MenuItem.builder().restaurant(r1).name("Loaded Peri-Peri Fries").description("Crispy golden fries tossed in African peri-peri spice & liquid cheese").price(149.0).category("Sides").isVeg(true).imageUrl("https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&q=80").rating(4.7).preparationTime(10).build(),
                MenuItem.builder().restaurant(r1).name("Thick Belgian Chocolate Milkshake").description("Rich dark chocolate ice cream blended with cold milk & chocolate drizzle").price(139.0).category("Beverages").isVeg(true).imageUrl("https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80").rating(4.9).preparationTime(8).build()
            ));

            // 2. Royal Biryani House
            Restaurant r2 = Restaurant.builder()
                .name("Royal Biryani House").cuisine("Indian").rating(4.9).deliveryTimeMin(30).deliveryTimeMax(45)
                .deliveryFee(25.0).minOrder(199.0).address("45, Brigade Road, Bangalore").city("Bangalore")
                .imageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80")
                .coverImageUrl("https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&q=80")
                .build();
            r2.setMenuItems(List.of(
                MenuItem.builder().restaurant(r2).name("Hyderabadi Dum Chicken Biryani").description("Slow-cooked fragrant basmati rice layered with marinated chicken & aromatic saffron").price(299.0).category("Biryani").isVeg(false).imageUrl("https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&q=80").rating(4.9).preparationTime(25).build(),
                MenuItem.builder().restaurant(r2).name("Mutton Lucknowi Dum Biryani").description("Tender lamb pieces dum cooked in Awadhi spices with mint mirchi ka salan & raita").price(399.0).category("Biryani").isVeg(false).imageUrl("https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&q=80").rating(4.8).preparationTime(30).build(),
                MenuItem.builder().restaurant(r2).name("Shahi Paneer Tikka Masala").description("Cottage cheese cubes grilled in tandoor simmered in rich cashew tomato gravy").price(249.0).category("Curry").isVeg(true).imageUrl("https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&q=80").rating(4.7).preparationTime(20).build(),
                MenuItem.builder().restaurant(r2).name("Butter Garlic Naan (2 Pcs)").description("Refined flour bread cooked in clay oven brushed with creamy garlic butter").price(69.0).category("Breads").isVeg(true).imageUrl("https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&q=80").rating(4.8).preparationTime(10).build(),
                MenuItem.builder().restaurant(r2).name("Hot Gulab Jamun with Rabri").description("Soft milk solids balls dipped in sugar syrup served hot with rabri").price(99.0).category("Desserts").isVeg(true).imageUrl("https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=500&q=80").rating(4.9).preparationTime(5).build()
            ));

            // 3. Pizza Republic
            Restaurant r3 = Restaurant.builder()
                .name("Pizza Republic").cuisine("Italian").rating(4.7).deliveryTimeMin(25).deliveryTimeMax(35)
                .deliveryFee(35.0).minOrder(249.0).address("88, 100 Feet Road, Indiranagar, Bangalore").city("Bangalore")
                .imageUrl("https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80")
                .coverImageUrl("https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80")
                .build();
            r3.setMenuItems(List.of(
                MenuItem.builder().restaurant(r3).name("Neapolitan Margherita Pizza").description("San Marzano tomato sauce, fresh mozzarella di bufala, fresh basil, extra virgin olive oil").price(349.0).category("Pizza").isVeg(true).imageUrl("https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&q=80").rating(4.9).preparationTime(18).build(),
                MenuItem.builder().restaurant(r3).name("Smokey Pepperoni Pizza").description("Spicy pork pepperoni, mozzarella cheese, crushed red chili flakes, oregano").price(449.0).category("Pizza").isVeg(false).imageUrl("https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80").rating(4.8).preparationTime(20).build(),
                MenuItem.builder().restaurant(r3).name("Truffle Mushroom Fettuccine").description("Handmade fettuccine pasta tossed in wild mushroom black truffle cream sauce").price(329.0).category("Pasta").isVeg(true).imageUrl("https://images.unsplash.com/photo-1621996346565-e3def6164286?w=500&q=80").rating(4.7).preparationTime(15).build(),
                MenuItem.builder().restaurant(r3).name("Cheesy Garlic Breadsticks").description("Oven baked dough sticks brushed with garlic butter and melted mozzarella").price(169.0).category("Sides").isVeg(true).imageUrl("https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&q=80").rating(4.6).preparationTime(10).build(),
                MenuItem.builder().restaurant(r3).name("Classic Italian Tiramisu").description("Espresso soaked ladyfingers layered with mascarpone cream & dusted cocoa powder").price(219.0).category("Desserts").isVeg(true).imageUrl("https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&q=80").rating(4.9).preparationTime(5).build()
            ));

            // 4. Dragon Palace
            Restaurant r4 = Restaurant.builder()
                .name("Dragon Palace").cuisine("Chinese").rating(4.6).deliveryTimeMin(20).deliveryTimeMax(35)
                .deliveryFee(30.0).minOrder(179.0).address("78, Koramangala 5th Block, Bangalore").city("Bangalore")
                .imageUrl("https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&q=80")
                .coverImageUrl("https://images.unsplash.com/photo-1563245372-f21724e3856d?w=1200&q=80")
                .build();
            r4.setMenuItems(List.of(
                MenuItem.builder().restaurant(r4).name("Crispy Chili Chicken").description("Wok-tossed crispy fried chicken pieces with soy sauce, garlic, green chilies & spring onion").price(279.0).category("Starters").isVeg(false).imageUrl("https://images.unsplash.com/photo-1525755662778-989d0524087e?w=500&q=80").rating(4.8).preparationTime(15).build(),
                MenuItem.builder().restaurant(r4).name("Schezwan Hakka Noodles").description("Stir-fried wheat noodles tossed with julienned vegetables & fiery Schezwan chili paste").price(199.0).category("Noodles").isVeg(true).imageUrl("https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&q=80").rating(4.7).preparationTime(12).build(),
                MenuItem.builder().restaurant(r4).name("Steamed Chicken Dim Sum (6 Pcs)").description("Delicate wheat wrappers filled with juicy minced chicken served with spicy dipping sauce").price(229.0).category("Starters").isVeg(false).imageUrl("https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&q=80").rating(4.9).preparationTime(15).build(),
                MenuItem.builder().restaurant(r4).name("Yangzhou Fried Rice").description("Aromatic jasmine rice fried with egg, chicken, prawns, scallions & sesame oil").price(259.0).category("Rice").isVeg(false).imageUrl("https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&q=80").rating(4.6).preparationTime(12).build()
            ));

            // 5. Tokyo Sushi Zen
            Restaurant r5 = Restaurant.builder()
                .name("Tokyo Sushi Zen").cuisine("Japanese").rating(4.9).deliveryTimeMin(30).deliveryTimeMax(45)
                .deliveryFee(45.0).minOrder(350.0).address("5, UB City Mall, Vittal Mallya Road, Bangalore").city("Bangalore")
                .imageUrl("https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80")
                .coverImageUrl("https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=1200&q=80")
                .build();
            r5.setMenuItems(List.of(
                MenuItem.builder().restaurant(r5).name("Fresh Salmon Nigiri (4 Pcs)").description("Sliced Norwegian salmon laid over seasoned Japanese sushi rice with wasabi").price(499.0).category("Sushi").isVeg(false).imageUrl("https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=500&q=80").rating(4.9).preparationTime(20).build(),
                MenuItem.builder().restaurant(r5).name("Spicy Tuna California Roll (8 Pcs)").description("Crab meat, avocado, cucumber rolled inside seaweed topped with spicy sriracha mayo").price(449.0).category("Sushi").isVeg(false).imageUrl("https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80").rating(4.8).preparationTime(20).build(),
                MenuItem.builder().restaurant(r5).name("Chicken Tonkotsu Ramen").description("Rich 12-hour pork & chicken bone broth, handmade ramen noodles, chashu pork, soft egg").price(479.0).category("Ramen").isVeg(false).imageUrl("https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80").rating(4.9).preparationTime(20).build(),
                MenuItem.builder().restaurant(r5).name("Crispy Veg Tempura Platter").description("Assorted crispy fried lotus root, sweet potato, zucchini in light Japanese batter").price(299.0).category("Starters").isVeg(true).imageUrl("https://images.unsplash.com/photo-1615361200141-f45040f367be?w=500&q=80").rating(4.7).preparationTime(15).build()
            ));

            // 6. Sweet Cravings Bakery
            Restaurant r6 = Restaurant.builder()
                .name("Sweet Cravings Bakery").cuisine("Desserts").rating(4.9).deliveryTimeMin(15).deliveryTimeMax(25)
                .deliveryFee(20.0).minOrder(99.0).address("33, Lavelle Road, Bangalore").city("Bangalore")
                .imageUrl("https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80")
                .coverImageUrl("https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&q=80")
                .build();
            r6.setMenuItems(List.of(
                MenuItem.builder().restaurant(r6).name("Belgian Chocolate Waffle").description("Freshly baked crispy waffle topped with warm Belgian chocolate & vanilla ice cream").price(199.0).category("Desserts").isVeg(true).imageUrl("https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&q=80").rating(4.9).preparationTime(10).build(),
                MenuItem.builder().restaurant(r6).name("Fudge Chocolate Lava Cake").description("Warm chocolate sponge cake with molten liquid truffle chocolate center").price(179.0).category("Desserts").isVeg(true).imageUrl("https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80").rating(4.9).preparationTime(8).build(),
                MenuItem.builder().restaurant(r6).name("Nutella Strawberry Crepe").description("French crepe stuffed with generous Nutella hazelnut spread & fresh strawberry slices").price(169.0).category("Desserts").isVeg(true).imageUrl("https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500&q=80").rating(4.8).preparationTime(10).build(),
                MenuItem.builder().restaurant(r6).name("Mango Passionfruit Sundae").description("Fresh Alphonso mango gelato, passionfruit coulis, whipped cream & toasted almonds").price(189.0).category("Desserts").isVeg(true).imageUrl("https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=500&q=80").rating(4.7).preparationTime(5).build()
            ));

            // 7. Taco Loco Mexican Grill
            Restaurant r7 = Restaurant.builder()
                .name("Taco Loco Mexican Grill").cuisine("Mexican").rating(4.7).deliveryTimeMin(20).deliveryTimeMax(35)
                .deliveryFee(30.0).minOrder(180.0).address("14, Church Street, Bangalore").city("Bangalore")
                .imageUrl("https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80")
                .coverImageUrl("https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80")
                .build();
            r7.setMenuItems(List.of(
                MenuItem.builder().restaurant(r7).name("Birria Beef Tacos (3 Pcs)").description("Slow-braised shredded beef in corn tortillas topped with cilantro & savory consommé dip").price(349.0).category("Mexican").isVeg(false).imageUrl("https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=500&q=80").rating(4.9).preparationTime(15).build(),
                MenuItem.builder().restaurant(r7).name("Grilled Chicken Burrito Bowl").description("Cilantro lime rice, black beans, fajita chicken, pico de gallo & guacamole").price(299.0).category("Mexican").isVeg(false).imageUrl("https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&q=80").rating(4.7).preparationTime(15).build(),
                MenuItem.builder().restaurant(r7).name("Cheesy Jalapeño Nachos Supreme").description("Crispy tortilla chips smothered in melted queso cheese, jalapeños & sour cream").price(219.0).category("Sides").isVeg(true).imageUrl("https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=500&q=80").rating(4.6).preparationTime(10).build()
            ));

            restaurantRepository.saveAll(List.of(r1, r2, r3, r4, r5, r6, r7));
            log.info("Rich food delivery dataset seeded successfully with 7 restaurants and 35+ items!");
        }
    }
}