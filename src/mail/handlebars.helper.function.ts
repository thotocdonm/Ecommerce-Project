import * as Handlebars from 'handlebars';

export function registerHandlebarsHelpers() {
    // Helper to generate full stars
    Handlebars.registerHelper('fullStars', function (avgRating) {
        const stars = [];
        for (let i = 0; i < Math.floor(avgRating); i++) {
            stars.push(1); // Push 1 for each full star
        }
        return stars;
    });

    // Helper to check if there's a half star
    Handlebars.registerHelper('isHalfStar', function (avgRating) {
        return avgRating % 1 !== 0; // Returns true if there's a decimal part
    });

    Handlebars.registerHelper('imageUrl', function (imageName) {
        const baseUrl = 'https://5c3b-2405-4802-1d95-4340-d7c-a195-9f74-d49c.ngrok-free.app/images/products/';
        return baseUrl + imageName;
    });
}
