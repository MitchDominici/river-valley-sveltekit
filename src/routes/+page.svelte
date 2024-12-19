<script>
    import {onMount} from 'svelte';

    onMount(() => {
        // Any JavaScript initialization for animations can go here
    });
</script>

<div class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative h-screen w-full overflow-hidden hero-section">
        <!-- Sky background -->
        <div class="absolute inset-0">
            <svg class="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 800">
                <!-- Sky gradient background -->
                <defs>
                    <linearGradient id="skyGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#87CEEB"/>
                        <stop offset="100%" style="stop-color:#B0E2FF"/>
                    </linearGradient>

                    <!-- Define the path for the boat to follow -->
                </defs>
                <path d="M-50,500 Q300,480 600,500 T1250,500" fill="none" id="boatPath"/>

                <!-- Sky background -->
                <rect fill="url(#skyGradient)" height="100%" width="100%"/>

                <!-- Decorative clouds -->
                <path d="M100,100 C120,95 130,95 150,100 C170,105 180,105 200,100"
                      fill="none" opacity="0.7" stroke="white" stroke-width="20"/>
                <path d="M300,150 C320,145 330,145 350,150 C370,155 380,155 400,150"
                      fill="none" opacity="0.7" stroke="white" stroke-width="20"/>
                <path d="M700,80 C720,75 730,75 750,80 C770,85 780,85 800,80"
                      fill="none" opacity="0.7" stroke="white" stroke-width="20"/>

                <!-- Green hills in background -->
                <path d="M0,400 Q200,350 400,400 T800,400 T1200,400 V800 H0 Z"
                      fill="#4a8e4a" opacity="0.6"/>
                <path d="M0,450 Q300,380 600,450 T1200,450 V800 H0 Z"
                      fill="#3b7a3b" opacity="0.7"/>

                <!-- River/water area -->
                <path d="M0,500 Q300,480 600,500 T1200,500 V800 H0 Z"
                      fill="#4682B4" opacity="0.8"/>

                <!--https://www.svgrepo.com/svg/484987/canoe-->
                <g transform="translate(0, 50) scale(0.3)" xmlns="http://www.w3.org/2000/svg">
                    <path d="M499.548,183.865H12.392C0.74,162.65-2.695,137.729,2.087,113.954   c5.86-29.231,21.014-53.41,35.158-64.927c5.792-4.715,15.626-2.223,13.942,6.735c-4.311,23.169,22.496,46.203,56.845,53.478   c7.139,1.549,14.615,2.357,22.159,2.357h41.96c33.878,0,72.201,0,72.201,0h23.304c0,0,10.574,0,25.459,0h88.703   c35.831,0,69.171-18.522,77.455-40.479c1.886-4.984,2.425-10.17,1.482-15.356c-0.808-4.647,1.414-7.543,4.58-8.621h0.067   c2.896-0.943,6.6-0.337,9.362,1.886c8.082,6.601,16.501,17.309,23.304,30.78c5.186,10.035,9.362,21.62,11.854,34.147   c0.606,3.098,1.078,6.129,1.414,9.227C513.693,144.06,509.786,165.344,499.548,183.865z"
                          style="fill:#F7C474;"/>
                    <path d="M12.419,183.835c16.969,30.726,51.402,53.582,103.803,53.582c69.884,0,128.126,0,128.126,0h23.297   c0,0,58.243,0,128.127,0c52.401,0,86.833-22.857,103.803-53.582H12.419z"
                          style="fill:#F6B848;"/>
                    <path d="M335.21,111.597c0,6.466-5.186,11.652-11.652,11.652H183.803c-6.466,0-11.652-5.186-11.652-11.652   c0-6.399,5.186-11.652,11.652-11.652h139.755C330.024,99.945,335.21,105.198,335.21,111.597z"
                          style="fill:#604C3F;"/>
                    <path d="M261.24,152.096c0,3.374-2.736,6.114-6.11,6.114h-59.406c-3.38,0-6.117-2.739-6.117-6.114l0,0   c0-3.378,2.736-6.117,6.117-6.117h59.406C258.504,145.979,261.24,148.719,261.24,152.096L261.24,152.096z"
                          style="fill:#8F6C5C;"/>
                    <g>
                        <path d="M346.391,11.377c0,1.819-0.472,3.704-1.414,5.456l-1.212,2.29l-44.25,80.822l-6.398,11.652    l-6.398,11.652l-23.843,43.577l-9.295,17.04l-29.298,53.545l-10.575,19.33l-0.538,0.943l-9.901,18.118l-4.647,8.486    c-0.943,1.751-2.29,3.098-3.84,4.108c-2.222,1.414-4.849,2.021-7.475,1.751c-1.414-0.202-2.761-0.673-4.108-1.347    c-1.482-0.808-2.694-1.953-3.637-3.233c-1.482-1.953-2.223-4.378-2.223-6.803c0-0.539,0.067-1.078,0.135-1.616v-0.067    c0.135-1.28,0.539-2.492,1.212-3.704l1.953-3.57l12.595-23.034l0.539-0.943l4.58-8.419l29.298-53.545l14.077-25.661l4.445-8.082    l2.223-4.176l12.46-22.698l6.331-11.652l6.399-11.652l37.448-68.43L325.04,5.921c3.031-5.523,9.968-7.543,15.424-4.513    C344.235,3.497,346.391,7.336,346.391,11.377z"
                              style="fill:#898B6C;"/>
                        <path d="M145.61,422.589c2.427,1.325,5.288,1.579,7.906,0.7c2.618-0.878,4.756-2.812,5.887-5.331    l65.142-144.925c2.118-4.716,0.257-10.267-4.282-12.75l-32.979-18.045c-4.532-2.483-10.215-1.059-13.043,3.269L87.296,378.504    c-1.507,2.312-1.986,5.15-1.315,7.827c0.671,2.681,2.434,4.956,4.854,6.281L145.61,422.589z"
                              style="fill:#85C68D;"/>
                        <polygon points="205.648,253.614 214.843,258.646 169.058,326.54" style="fill:#83BC94;"/>
                        <polygon points="200.281,250.677 191.086,245.645 158.587,320.811" style="fill:#A4D3A2;"/>
                    </g>
                    <!-- Animation for the boat -->
                    <animateMotion dur="20s" repeatCount="indefinite" rotate="auto">
                        <mpath xlink:href="#boatPath"/>
                    </animateMotion>
                </g>
            </svg>

            <!-- Keep your existing clouds divs -->
            <div class="cloud cloud-1"></div>
            <div class="cloud cloud-2"></div>
            <div class="cloud cloud-3"></div>
        </div>

        <div class="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent">
            <div class="text-center text-white z-10 px-4">
                <div class="text-3xl md:text-4xl font-accent opacity-0 transform -translate-y-4 animate-fade-in">
                    Welcome to the
                </div>
                <h1 class="font-display text-6xl md:text-8xl lg:text-9xl my-6 drop-shadow-lg opacity-0 transform -translate-y-4 animate-fade-in animation-delay-200">
                    Missouri River<br/>Valley Loop
                </h1>
                <p class="max-w-3xl mx-auto text-xl md:text-2xl opacity-0 transform -translate-y-4 animate-fade-in animation-delay-400 leading-relaxed">
                    Experience the charm of historic districts, winding trails, and vibrant local culture as
                    you journey through the heart of Missouri. Discover hidden gems and create unforgettable
                    memories along this carefully curated route.
                </p>
                <a
                        class="mt-8 px-10 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors opacity-0 transform -translate-y-4 animate-fade-in animation-delay-600 font-fun text-2xl md:text-3xl inline-block"
                        href="/towns"
                >
                    Start The Loop
                </a>
            </div>
        </div>
    </div>
</div>