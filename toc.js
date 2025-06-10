// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded affix "><a href="posts/hello.html">Hello</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Learning Rust</li><li class="chapter-item expanded "><a href="posts/rust/001_mpbt.html"><strong aria-hidden="true">1.</strong> Passing messages between threads</a></li><li class="chapter-item expanded "><a href="posts/rust/002_requesting_arbitrary_data.html"><strong aria-hidden="true">2.</strong> Improvement on message passing: Requesting arbitrary data</a></li><li class="chapter-item expanded "><a href="posts/rust/003_generic_actor_model.html"><strong aria-hidden="true">3.</strong> Designing and Implementing a Generic Actor Model for Concurrency</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Flutter</li><li class="chapter-item expanded "><a href="posts/flutter/001_input_toolbar.html"><strong aria-hidden="true">4.</strong> Implementing an Input Toolbar in Flutter</a></li><li class="chapter-item expanded affix "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Developer</li><li class="chapter-item expanded "><a href="posts/developer/001_good_qs/gq.html"><strong aria-hidden="true">5.</strong> Job application questions I liked</a></li><li><ol class="section"><li class="chapter-item expanded "><a href="posts/developer/001_good_qs/bluecode.html"><strong aria-hidden="true">5.1.</strong> Bluecode</a></li><li class="chapter-item expanded "><a href="posts/developer/001_good_qs/wingback.html"><strong aria-hidden="true">5.2.</strong> Wingback</a></li></ol></li><li class="chapter-item expanded "><li class="spacer"></li><li class="chapter-item expanded affix "><li class="part-title">Tricks</li><li class="chapter-item expanded "><a href="posts/tricks/001_post_files_through_curl.html"><strong aria-hidden="true">6.</strong> POSTing files using CURL</a></li><li class="chapter-item expanded "><a href="posts/tricks/002_compress_a_video_with_ffmpeg.html"><strong aria-hidden="true">7.</strong> Compress a video using FFMPEG</a></li><li class="chapter-item expanded affix "><li class="part-title">Upcarta</li><li class="chapter-item expanded "><div><strong aria-hidden="true">8.</strong> What is Upcarta (to me)?</div></li><li class="chapter-item expanded affix "><li class="part-title">Philosophy</li><li class="chapter-item expanded "><a href="posts/philosophy/001_foss_thm.html"><strong aria-hidden="true">9.</strong> Open Source Software and the Triple Helix Model of Science</a></li><li class="chapter-item expanded "><a href="posts/philosophy/002_ai_kuhn.html"><strong aria-hidden="true">10.</strong> Does the Shift from Behavioral AI to Deep Learning Constitute a Kuhnian Paradigm Shift?</a></li><li class="chapter-item expanded affix "><li class="part-title">Mania Devlog</li><li class="chapter-item expanded "><a href="posts/mania_devlog/001_day_one.html"><strong aria-hidden="true">11.</strong> day one: dev env, camera, frame-rate independence, moods</a></li><li class="chapter-item expanded "><a href="posts/mania_devlog/002_day_two.html"><strong aria-hidden="true">12.</strong> day two: automatic hot reload, smashing jump, player states</a></li><li class="chapter-item expanded "><a href="posts/mania_devlog/003_day_three.html"><strong aria-hidden="true">13.</strong> day three: handle-based entity system, reading game data from json</a></li><li class="chapter-item expanded "><a href="posts/mania_devlog/004.ui_for_letters.html"><strong aria-hidden="true">14.</strong> day four: UI for letters</a></li><li class="chapter-item expanded "><a href="posts/mania_devlog/005.platform_tiles_and_inspired_special.html"><strong aria-hidden="true">15.</strong> day five: platform tiles and inspired special</a></li><li class="chapter-item expanded affix "><li class="spacer"></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0].split("?")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
