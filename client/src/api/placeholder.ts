import type { UserWithRole } from "../types";

export default {
    id: "c7deb881-1939-4208-9a63-61a885f02d8f",
    createdAt: new Date("2024-08-27T23:16:10.554Z"),
    updatedAt: new Date("2024-09-03T23:16:10.554Z"),
    first: "Mark",
    last: "Tipton",
    roleId: "5237711f-7969-4923-aacc-a623a4e9dac1",
    role: {
        id: "5237711f-7969-4923-aacc-a623a4e9dac1",
        createdAt: new Date("2024-08-27T23:16:10.554Z"),
        updatedAt: new Date("2024-08-27T23:16:10.554Z"),
        name: "Design",
        isDefault: false,
        description:
            "Designers create the visual and interactive elements of our products and services.",
    },
    photo: "https://i.pravatar.cc/400?img=51",
} as UserWithRole;