package com.SocialApp.SocialApp.configuration;

import com.SocialApp.SocialApp.features.authentication.model.User;
import com.SocialApp.SocialApp.features.authentication.repository.AuthenticationUserRepository;
import com.SocialApp.SocialApp.features.authentication.utilities.Encoder;
import com.SocialApp.SocialApp.features.feed.model.Post;
import com.SocialApp.SocialApp.features.feed.repository.PostRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashSet;
import java.util.List;
import java.util.Random;

@Configuration
public class LoadDatabaseConfiguration {
    private final Encoder encoder;

    public LoadDatabaseConfiguration(Encoder encoder) {
        this.encoder = encoder;
    }

    @Bean
    public CommandLineRunner initDatabase(AuthenticationUserRepository userRepository, PostRepository postRepository) {
        return args -> {
            List<User> users = createUsers(userRepository);

            createPosts(postRepository, users);
        };
    }

    private List<User> createUsers(AuthenticationUserRepository userRepository) {
        List<User> users = List.of(
                createUser("filipkrstic01@gmail.com", "filip", "Filip", "Krstic", "flifovich","Software Engineer",
                        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
                createUser("stevanstojanovic@gmail.com", "stevan", "Stevan", "Stojanovic", "voste", "The cverglan hunter",
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
                createUser("jovandjordjevic@gmail.com", "jovan", "Jovan", "Djordjevic","joca", "QA Automation Engineer",
                        "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?q=80&w=2725&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
                createUser("lazarpopovic@gmail.com", "lazar", "Lazar", "Popovic", "frozen", "Software Engineer",
                        "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
                createUser("igorignjatovic@gmail.com", "igor", "Igor", "Ignjatovic", "kokshi","B92!!!",
                        "https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=2967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
                createUser("nikolailic@gmail.com", "nikola", "Nikola", "Ilic", "patanovich", "Amazon!!!",
                        "https://images.unsplash.com/photo-1640951613773-54706e06851d?q=80&w=2967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
                );

        userRepository.saveAll(users);
        return users;
    }

    private User createUser(String email, String password, String firstName, String lastName, String username,
                            String description, String profilePicture) {
        User user = new User(email, encoder.encode(password));
        user.setEmailVerified(true);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setUsername(username);
        user.setDescription(description);
        user.setProfilePicture(profilePicture);
        return user;
    }


    private void createPosts(PostRepository postRepository, List<User> users) {
        Random random = new Random();

        for (int i = 1; i <= 10; i++) {
            Post post = new Post("Neki content neki content neki content neki content neki content", users.get(random.nextInt(users.size())));
            post.setLikes(generateLikes(users, i, random));
            if(i == 1){
                post.setPicture("\"https://images.unsplash.com/photo-1731176497854-f9ea4dd52eb6?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D\"");
            }
            postRepository.save(post);
        }
    }

    private HashSet<User> generateLikes(List<User> users,int postNumber, Random random) {
        HashSet<User> likes = new HashSet<>();
        int likesCount = random.nextInt(4);

        while (likes.size() < likesCount) {
            likes.add(users.get(random.nextInt(users.size())));
        }

        return likes;
    }
}
