import { UserSignupInterface } from "../Api/apiInterface";

export const mockUsers: UserSignupInterface[] = [
    {
        email: "john.doe@example.com",
        password: "password123",
        nickname: "JohnDoe",
        familycode: "FAM1234",
        avatarColor: "#FF5733",
        avatarUrl: "https://example.com/avatar1.jpg",
        avatarFgColor: "#FFFFFF",
    },
    {
        email: "jane.smith@example.com",
        password: "securePass456",
        nickname: "JaneSmith",
        familycode: "FAM5678",
        avatarColor: "#33FF57",
        avatarUrl: "https://example.com/avatar2.jpg",
        avatarFgColor: "#000000",
    },
    {
        email: "bob.jones@example.com",
        password: "bobspassword789",
        nickname: "BobJones",
        familycode: "FAM91011",
        avatarColor: "#3357FF",
        avatarUrl: "https://example.com/avatar3.jpg",
        avatarFgColor: "#FFFF00",
    },
    {
        email: "alice.green@example.com",
        password: "alicepassword101",
        nickname: "AliceGreen",
        familycode: "FAM1213",
        avatarColor: "#FF33A5",
        avatarUrl: "https://example.com/avatar4.jpg",
        avatarFgColor: "#0000FF",
    },
    {
        email: "charlie.brown@example.com",
        password: "charliepass202",
        nickname: "CharlieBrown",
        familycode: "FAM1415",
        avatarColor: "#F1C40F",
        avatarUrl: "https://example.com/avatar5.jpg",
        avatarFgColor: "#000000",
    }
];
