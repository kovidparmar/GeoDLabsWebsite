# GeoD Lab Website

The official website for GeoD Lab at IIT Gandhinagar. The site presents the lab's research areas, publications, team, and contact information in a responsive static website.

**Live site:** [geod-lab.github.io/GeoDLabsWebsite](https://geod-lab.github.io/GeoDLabsWebsite/)

## Contents

- **Home** - Lab overview, research highlights, and latest news
- **About** - Information about GeoD Lab and its research mission
- **Research** - Geodynamic modelling, statistical seismology, and seismic interpretation
- **Publications** - Selected publications and research output
- **Team** - Lab members and collaborators
- **Contact** - Contact details and enquiry form

## Technology

- HTML5 for page structure
- CSS3 for responsive styling
- Vanilla JavaScript for navigation, animations, smooth scrolling, and form validation
- Font Awesome for interface icons
- GitHub Pages for hosting

## Project Structure

```text
.
├── index.html          # Home page
├── about.html          # About the lab
├── research.html       # Research areas
├── publications.html   # Publications
├── team.html           # Team members
├── contact.html        # Contact page
├── styles.css          # Shared site styles
├── script.js           # Shared site interactions
└── images/             # Images and logos
```

## Run Locally

No build tools or package installation are required. Clone the repository and start a local static server:

```bash
git clone https://github.com/kovidparmar/GeoDLabsWebsite.git
cd GeoDLabsWebsite
python -m http.server 8000
```

Open [localhost:8000](http://localhost:8000) in a browser. Using a local server keeps relative links and assets working consistently.

You can also open `index.html` directly, although some browser features may behave differently when loaded from a local file.

## Updating the Site

1. Edit the relevant HTML page or shared asset.
2. Refresh the local server and check the page at desktop and mobile widths.
3. Verify navigation links, images, contact form validation, and accessibility labels.
4. Commit and push the changes to the configured GitHub Pages branch.

## License

No license has been specified for this repository. Contact the GeoD Lab maintainers before reusing site content or assets.
