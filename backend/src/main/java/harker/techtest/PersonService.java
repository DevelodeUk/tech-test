package harker.techtest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PersonService {

    @Autowired
    private PersonRepository personRepository;

    public List<Person> getAllPeople() {
        List<Person> people = new ArrayList<>();

        personRepository.findAll().forEach(people::add);

        return people;
    }

    public Person getPerson(String id) {
        return personRepository.findById(id).orElseThrow(() -> new RuntimeException("Value not present"));
    }

    public boolean isValidNames(String fname, String lname) {
        boolean fnameValid = fname.charAt(0) == Character.toUpperCase(fname.charAt(0));
        boolean lnameValid = lname.charAt(0) == Character.toUpperCase(lname.charAt(0));
        return fnameValid && lnameValid;
    }
    public Person postPerson(Person person) {
        // Task 2

        // validation for task 2 (making sure the user did not adjust frontend to bypass validation)
        if (!isValidNames(person.firstName, person.lastName)) {
            throw
            new RuntimeException("Names must start with a capital letter");
        }
        try {
            if (!personRepository.existsById(person.id)) {
                personRepository.save(person);
            } else {
                throw
                new RuntimeException("Data already exists for this Person");
            }
            
        } catch (Exception e) {
            throw
            new RuntimeException("Problem with adding person (POST)");
        }
        return person;
    }

    public Person putPerson(Person person, String id) {
        // validation for task 2 (making sure the user did not adjust frontend to bypass validation)
        if (!isValidNames(person.firstName, person.lastName)) {
            throw
            new RuntimeException("Names must start with a capital letter");
        }
        try {
            Person personToUpdate = personRepository.findById(id).orElse(new Person()); 
            personToUpdate.firstName = person.firstName != null ? person.firstName : personToUpdate.firstName;
            personToUpdate.lastName = person.lastName != null ? person.lastName : personToUpdate.lastName;
            personToUpdate.DOB = person.DOB != null ? person.DOB : personToUpdate.DOB;
            personToUpdate.phoneNumber = person.phoneNumber != null ? person.phoneNumber : personToUpdate.phoneNumber;
            personToUpdate.email = person.email != null ? person.email : personToUpdate.email;
            personRepository.save(personToUpdate);
            return personToUpdate;
        } catch (Exception e) {
            new RuntimeException("Problem with updating person (PUT)");
        }
        return person;
    }
    
}