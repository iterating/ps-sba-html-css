export async function toggleDrawer() {
  try {
    const drawer = document.querySelector(".drawer");
    const overlay = document.querySelector(".overlay");
    const content = document.querySelector(".content");
    if (!drawer || !overlay || !content) {
      throw new Error("drawer, overlay, content elements not found.");
    }
    drawer.classList.toggle("open");
    overlay.classList.toggle("open");
    content.classList.toggle("drawer-open");
  } catch (error) {
    console.error(error.message);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.querySelector(".drawer-icon");
  const overlay = document.querySelector(".overlay");

  [menuIcon, overlay].forEach((element) => {
    if (element) {
      element.addEventListener("click", toggleDrawer);
    } else console.error(".drawer-icon .overlay elements not found on page");
  });
});


export async function fetchYaml(url) {
  try {
    // Fetch the data source
    const response = await fetch(url, { method: "GET" });
    if (!response.ok) {
      throw new Error(response.status);
        }
    // Convert YAML-textformat-> JSON
    const page = await response.text().then(jsyaml.load);
    return page;
    } catch (error) {
      console.error("YAML file not loaded:", error.message);  }
}

export async function fetchMarkdown(url, target) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("HTTP error: ${response.status}");
    }
    const markdownText = await response.text();
    console.log(markdownText);
    const htmlText = await DOMPurify.sanitize(marked.parse(markdownText));
    const content = document.querySelector(target);
    content.innerHTML = htmlText;
  } catch (error) {
    console.error("markdown file not loaded", error.message);
  }
}

// Hero section
export function renderHeroSection(page) {
  const heroDiv = document.createElement("div");
  heroDiv.className = "landing-hero";

  // These are temporary variables that exist only within scope of each function, so Im not concerned about naming
  const h1 = document.createElement("h1");
  h1.textContent = page.hero.title;
  heroDiv.appendChild(h1);

  const p = document.createElement("p");
  p.textContent = page.hero.description;
  heroDiv.appendChild(p);

  const img = document.createElement("img");
  img.src = page.hero.image;
  img.alt = "Landing Image";
  img.className = "hero-image";
  heroDiv.appendChild(img);

  return heroDiv;
}

// Feature sections
export function renderFeatureSections(page) {
  const sectionsDiv = document.createElement("div");

  page.sections.forEach((section) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "landing-section";

    const h2 = document.createElement("h2");
    h2.textContent = section.title;
    sectionDiv.appendChild(h2);

    const p = document.createElement("p");
    p.textContent = section.description;
    sectionDiv.appendChild(p);

    section.features.forEach((feature) => {
      const featureDiv = document.createElement("div");
      featureDiv.className = "landing-card";

      const h3 = document.createElement("h3");
      h3.textContent = feature.name;
      featureDiv.appendChild(h3);

      const featureDesc = document.createElement("p");
      featureDesc.textContent = feature.description;
      featureDiv.appendChild(featureDesc);

      const img = document.createElement("img");
      img.src = feature.icon;
      img.className = "landing-feature-pic";
      featureDiv.appendChild(img);

      sectionDiv.appendChild(featureDiv);
    });

    sectionsDiv.appendChild(sectionDiv);
  });

  return sectionsDiv;
}

// General Features
export function renderGeneralFeatures(page) {
  const generalFeaturesDiv = document.createElement("div");
  generalFeaturesDiv.className = "landing-general-features";

  const h2 = document.createElement("h2");
  h2.textContent = page.features.title;
  generalFeaturesDiv.appendChild(h2);

  const p = document.createElement("p");
  p.textContent = page.features.description;
  generalFeaturesDiv.appendChild(p);

  const gridDiv = document.createElement("div");
  gridDiv.className = "data-grid";

  page.features.items.forEach((feature) => {
    const featureDiv = document.createElement("div");
    featureDiv.className = "landing-card";

    const h3 = document.createElement("h3");
    h3.textContent = feature.title;
    featureDiv.appendChild(h3);

    const featureDesc = document.createElement("p");
    featureDesc.textContent = feature.description;
    featureDiv.appendChild(featureDesc);

    const img = document.createElement("img");
    img.src = feature.icon;
    img.className = "landing-feature-pic";
    featureDiv.appendChild(img);

    gridDiv.appendChild(featureDiv);
  });

  // Putting these in a main axis grid
  generalFeaturesDiv.appendChild(gridDiv);

  return generalFeaturesDiv;
}

// Testimonials section
export function renderTestimonials(page) {
  const testimonialsDiv = document.createElement("div");
  testimonialsDiv.className = "landing-section";

  const h2 = document.createElement("h2");
  h2.textContent = page.testimonials.title;
  testimonialsDiv.appendChild(h2);

  const p = document.createElement("p");
  p.textContent = page.testimonials.description;
  testimonialsDiv.appendChild(p);

  const columnsDiv = document.createElement("div");
  columnsDiv.className = "data-columns";

  // Card for each testimonial
  page.testimonials.items.forEach((testimonial) => {
    const testimonialCard = document.createElement("div");
    testimonialCard.className = "testimonial-card";

    const quote = document.createElement("p");
    quote.textContent = testimonial.quote;
    testimonialCard.appendChild(quote);

    const authorDiv = document.createElement("div");
    authorDiv.className = "testimonial-author";

    const img = document.createElement("img");
    img.src = testimonial.author.avatar.src;
    img.alt = testimonial.author.name;
    img.className = "testimonial-avatar";
    authorDiv.appendChild(img);

    const span = document.createElement("span");
    span.textContent = testimonial.author.name;
    authorDiv.appendChild(span);

    testimonialCard.appendChild(authorDiv);
    columnsDiv.appendChild(testimonialCard);
  });

  testimonialsDiv.appendChild(columnsDiv);

  return testimonialsDiv;
}

// CTA section
export function renderCTA(page) {
  const ctaDiv = document.createElement("div");
  ctaDiv.className = "landing-cta";

  const h2 = document.createElement("h2");
  h2.textContent = page.cta.title;
  ctaDiv.appendChild(h2);

  const p = document.createElement("p");
  p.textContent = page.cta.description;
  ctaDiv.appendChild(p);

  // Dynamically create link for each link in array
  page.cta.links.forEach((link) => {
    const a = document.createElement("a");
    a.href = link.to;
    a.target = "_blank";
    a.className = "cta-button";
    a.textContent = link.label;
    ctaDiv.appendChild(a);
  });

  return ctaDiv;
}
// choose data url, target element to render to, and sections to render
export async function renderLandingPage(url, target, ...renderSelected) {
  try{
    const page = await fetchYaml(url);
    if(!page){throw new Error("Yaml not loaded")};
    
    const content = document.getElementById(target);
    if(!content){throw new Error("#${target} element not found")};
    
    const selectFunctions = {
      renderHeroSection,
      renderFeatureSections,
      renderGeneralFeatures,
      renderTestimonials,
      renderCTA,
    };

     renderSelected.forEach((funcName) => {
       const renderFunction = selectFunctions[funcName];
       if (renderFunction) {
         content.appendChild(renderFunction(page));
       } else {
         console.error(`Function ${funcName} not found`);
       }
     });
     //console.log(renderSelected);

  } catch(error){
  console.error("error rendering page",error.message);
  }
}