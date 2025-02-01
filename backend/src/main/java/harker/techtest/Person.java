package harker.techtest;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Person {

    @Id
    public String id;

    // Task 1

    public String firstName;
    public String lastName;
    public String DOB;
    public String phoneNumber;
    public String email;
}