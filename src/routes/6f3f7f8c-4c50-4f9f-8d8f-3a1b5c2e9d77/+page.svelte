<script lang="ts">
    import {base} from '$app/paths';

    const huntHighlights = [
        {
            title: 'Window Clues & Storefront Surprises',
            description: 'Spot playful details in downtown windows, murals, and front porches as you wander through river towns.',
            icon: '🪟'
        },
        {
            title: 'History Hidden In Plain Sight',
            description: 'Follow clues tied to river heritage, landmarks, and local stories that make each stop feel memorable.',
            icon: '🗺️'
        },
        {
            title: 'Small-Town Prize Stops',
            description: 'Wrap up the adventure with a treat, keepsake, or local favorite waiting at the finish line.',
            icon: '🎁'
        }
    ];

    const perfectFor = ['Families on a weekend outing', 'Visitors exploring multiple towns', 'Magazine readers looking for a day trip', 'Businesses wanting more foot traffic'];

    const sampleStops = [
        'Find the mural, the caboose, and the oldest brick storefront.',
        'Match river-themed clues to downtown landmarks.',
        'Collect stamps, selfies, or correct answers as you go.',
        'Finish with a snack, photo op, or local prize pickup.'
    ];
</script>

<svelte:head>
    <title>Scavenger Hunts | Missouri River Valley LOOP</title>
    <meta
            content="Plan a playful Missouri River Valley LOOP scavenger hunt for families, visitors, and magazine readers looking for a memorable day trip."
            name="description"
    />
</svelte:head>

<div class="px-4 py-8" id="scavenger-hunts-page">
    <section class="max-w-6xl mx-auto">
        <div class="relative overflow-hidden rounded-[2rem] border-4 border-dashed border-primary-blue bg-gradient-to-br from-sky-100 via-white to-cyan-50 shadow-2xl">
            <div class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-blue-200/70 to-transparent"></div>
            <div class="absolute -right-10 top-8 h-40 w-40 rounded-full bg-secondary-yellow/30 blur-2xl"></div>
            <div class="absolute left-8 top-10 h-24 w-24 rounded-full bg-soft-sky-blue/50 blur-xl"></div>

            <div class="grid gap-10 px-6 py-10 md:grid-cols-[1.15fr,0.85fr] md:px-10 md:py-14 lg:px-14">
                <div class="relative z-10">
                    <div class="mb-4 inline-flex items-center rounded-full border-2 border-white bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary-blue shadow">
                        New Adventure Feature
                    </div>
                    <h1 class="text-4xl font-fun leading-tight text-primary-blue md:text-6xl">
                        Scavenger hunts made for curious river-town explorers
                    </h1>
                    <p class="mt-6 max-w-2xl text-lg leading-relaxed text-slate-700 md:text-2xl">
                        Turn a simple day trip into a playful challenge. Our scavenger hunts invite families,
                        couples, and weekend wanderers to follow clues, discover local gems, and make each
                        Missouri River Valley LOOP stop more memorable.
                    </p>

                    <div class="mt-8 flex flex-wrap gap-4">
                        <a
                                class="inline-block rounded-full bg-blue-600 px-8 py-4 font-fun text-xl text-white shadow-lg transition-colors hover:bg-blue-700"
                                href="mailto:MORiverValleyLOOP@gmail.com?subject=Scavenger%20Hunt%20Inquiry"
                        >
                            Plan A Hunt
                        </a>
                        <a
                                class="inline-block rounded-full border-2 border-primary-blue bg-white px-8 py-4 font-accent text-2xl text-primary-blue transition-colors hover:bg-blue-50"
                                href="{base}/towns"
                        >
                            Explore The Towns
                        </a>
                    </div>
                </div>

                <div class="relative z-10">
                    <div class="rotate-[-2deg] rounded-[1.75rem] border-[10px] border-white bg-[#fff8dc] p-6 shadow-xl">
                        <div class="mb-4 flex items-center justify-between">
                            <div>
                                <p class="text-sm uppercase tracking-[0.25em] text-earthy-brown">Adventure Postcard</p>
                                <h2 class="font-display text-3xl text-primary-blue">What to expect</h2>
                            </div>
                            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-yellow text-3xl shadow-md">
                                🔎
                            </div>
                        </div>

                        <div class="space-y-4">
                            {#each sampleStops as stop, index}
                                <div class="rounded-2xl border-2 border-dashed border-muted-gold bg-white/80 p-4">
                                    <div class="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-earthy-brown">
                                        Stop {index + 1}
                                    </div>
                                    <p class="text-lg leading-relaxed text-slate-700">{stop}</p>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <section class="max-w-6xl mx-auto mt-14">
        <div class="text-center mb-10">
            <h2 class="text-4xl md:text-5xl font-fun text-primary-blue">Why it works so well</h2>
            <p class="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-slate-700 leading-relaxed">
                The hunts fit the current LOOP personality: light, scenic, and community-focused, while also
                giving magazine readers a clear reason to visit in person.
            </p>
        </div>

        <div class="grid gap-6 md:grid-cols-3">
            {#each huntHighlights as highlight}
                <div class="rounded-[1.75rem] border-4 border-dashed border-soft-sky-blue bg-white/90 p-8 shadow-lg transition-transform duration-300 hover:-translate-y-1">
                    <div class="mb-5 text-4xl">{highlight.icon}</div>
                    <h3 class="text-2xl font-display text-primary-blue">{highlight.title}</h3>
                    <p class="mt-4 text-lg leading-relaxed text-slate-700">{highlight.description}</p>
                </div>
            {/each}
        </div>
    </section>

    <section class="max-w-6xl mx-auto mt-14">
        <div class="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
            <div class="rounded-[1.75rem] border-4 border-dashed border-muted-gold bg-secondary-yellow/20 p-8 shadow-lg">
                <h2 class="text-3xl md:text-4xl font-fun text-primary-blue">Perfect for</h2>
                <div class="mt-6 space-y-4">
                    {#each perfectFor as item}
                        <div class="flex items-start gap-3 rounded-2xl bg-white/85 p-4 shadow-sm">
                            <span class="mt-1 text-xl text-secondary-yellow">✦</span>
                            <p class="text-lg text-slate-700">{item}</p>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="rounded-[1.75rem] border-4 border-dashed border-primary-blue bg-white/95 p-8 shadow-lg">
                <h2 class="text-3xl md:text-4xl font-fun text-primary-blue">Magazine-ready message</h2>
                <div class="mt-6 rounded-[1.5rem] bg-gradient-to-br from-blue-50 to-sky-100 p-6">
                    <p class="font-display text-2xl leading-relaxed text-earthy-brown md:text-3xl">
                        Looking for a fun day trip?
                    </p>
                    <p class="mt-4 text-lg leading-relaxed text-slate-700 md:text-xl">
                        Follow the Missouri River Valley LOOP and join a scavenger hunt full of clues, local
                        charm, downtown discoveries, and small-town surprises. It is an easy way to turn a
                        magazine ad into an actual visit.
                    </p>
                </div>

                <div class="mt-6 flex flex-wrap gap-4">
                    <a
                            class="inline-block rounded-full bg-primary-blue px-7 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
                            href="mailto:MORiverValleyLOOP@gmail.com?subject=Advertise%20Me%20Scavenger%20Hunts"
                    >
                        Use This Promotion
                    </a>
                    <a
                            class="inline-block rounded-full border-2 border-primary-blue px-7 py-3 text-lg font-semibold text-primary-blue transition-colors hover:bg-blue-50"
                            href="{base}/about"
                    >
                        Learn About The LOOP
                    </a>
                </div>
            </div>
        </div>
    </section>
</div>
