function fade_in_products() {
    const elements = document.querySelectorAll('.product-container');
    let timing = 0;
    for (const element of elements) {
        setTimeout(() => {
            //Set opacity to fully visible
            element.style.opacity = 1;
            //Reset to home position
            element.style.transform = 'none';
        }, timing);
        timing += 125;
    }
}

document.addEventListener('DOMContentLoaded', fade_in_products);