(() => {
        'use strict';

        let regModal, newsModal, chatModal;

        $(document).ready(function() {
            regModal = new bootstrap.Modal(document.getElementById('registerModal'));
            newsModal = new bootstrap.Modal(document.getElementById('newsDetailModal'));
            chatModal = new bootstrap.Modal(document.getElementById('chatModal'));

            // 1. SPA PAGE NAVIGATION SWITCHER
            $('.nav-switch').on('click', function(e) {
                e.preventDefault();
                const targetId = $(this).data('target');
                switchTab(targetId);
            });

            $('#homeLink').on('click', function(e) {
                e.preventDefault();
                switchTab('games-section');
            });

            // 2. GAMES & CHAT LOGIC
            const gameChatDetails = {
                "Honor of Kings": { channel: "#hok-utar-squad", members: "142 Players Online", icon: "fa-mobile-screen" },
                "Valorant": { channel: "#valorant-ranked-lobby", members: "286 Players Online", icon: "fa-crosshairs" },
                "League of Legends": { channel: "#lol-summoners-rift", members: "198 Players Online", icon: "fa-shield-halved" },
                "Dota 2": { channel: "#dota2-ancient-defense", members: "115 Players Online", icon: "fa-dragon" },
                "Counter-Strike 2": { channel: "#cs2-premier-scrims", members: "230 Players Online", icon: "fa-bomb" }
            };

            const FAV_KEY = 'esports_fav_games';

            function getFavorites() {
                const saved = localStorage.getItem(FAV_KEY);
                return saved ? JSON.parse(saved) : [];
            }

            function setFavorites(favs) {
                localStorage.setItem(FAV_KEY, JSON.stringify(favs));
                updateGamesUI();
            }

            function updateGamesUI() {
                const favs = getFavorites();
                $('#favCountBadge').text(`${favs.length} Selected`);

                $('.btn-plus-fav').each(function() {
                    const gameName = $(this).data('game');
                    if (favs.includes(gameName)) {
                        $(this).addClass('active').html('<i class="fa-solid fa-check"></i>');
                    } else {
                        $(this).removeClass('active').html('<i class="fa-solid fa-plus"></i>');
                    }
                });

                // Render dynamic chat cards
                const container = $('#joinedChatsContainer');
                if (favs.length === 0) {
                    container.html(`
                        <div class="col-12 text-center py-4">
                            <i class="fa-solid fa-comments text-secondary display-6 mb-2"></i>
                            <p class="text-secondary mb-0">No games selected yet. Click the <span class="text-yellow fw-bold">+</span> on any game above to join its chat room!</p>
                        </div>
                    `);
                    return;
                }

                let chatHtml = '';
                favs.forEach(game => {
                    const chat = gameChatDetails[game] || { channel: "#general", members: "50 Online", icon: "fa-gamepad" };
                    chatHtml += `
                        <div class="col">
                            <div class="chat-card d-flex flex-column justify-content-between h-100">
                                <div>
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <h4 class="h6 fw-bold text-white mb-0"><i class="fa-solid ${chat.icon} text-yellow me-2"></i>${game}</h4>
                                        <span class="badge bg-success chat-status"><i class="fa-solid fa-circle me-1 chat-status-dot"></i>Active</span>
                                    </div>
                                    <p class="text-light small mb-1 chat-channel"><i class="fa-brands fa-discord me-1 text-primary"></i> ${chat.channel}</p>
                                    <small class="text-secondary chat-member-count"><i class="fa-solid fa-users me-1"></i>${chat.members}</small>
                                </div>
                                <button class="btn btn-discord btn-sm w-100 mt-3 rounded-pill btn-open-chat" data-gamename="${game}" data-channel="${chat.channel}">
                                    <i class="fa-solid fa-comment-dots me-1"></i> Join ${game} Chat
                                </button>
                            </div>
                        </div>
                    `;
                });
                container.html(chatHtml);
            }

            $('.btn-plus-fav').on('click', function(e) {
                e.stopPropagation();
                const gameName = $(this).data('game');
                let favs = getFavorites();
                favs = favs.includes(gameName) ? favs.filter(g => g !== gameName) : [...favs, gameName];
                setFavorites(favs);
            });

            $(document).on('click', '.btn-open-chat', function() {
                const gameName = $(this).data('gamename');
                const channel = $(this).data('channel');
                $('#modalGameTitle').text(`${gameName} Division Chat`);
                $('#modalChannelInfo').text(`Entering official UTAR Esports ${channel} Discord channel.`);
                chatModal.show();
            });

            // Weekly schedule render
            const weeklySchedule = [
                { day: "Monday", game: "Honor of Kings", time: "8:00 PM", venue: "Room G011", icon: "fa-location-dot" },
                { day: "Tuesday", game: "Valorant", time: "8:00 PM", venue: "Online", icon: "fa-globe" },
                { day: "Wednesday", game: "League of Legends", time: "8:00 PM", venue: "Room G012", icon: "fa-location-dot" },
                { day: "Thursday", game: "Dota 2", time: "8:00 PM", venue: "UTAR Cyber Cafe", icon: "fa-desktop" },
                { day: "Friday", game: "Counter-Strike 2", time: "8:00 PM", venue: "Online", icon: "fa-globe" }
            ];

            let schedHtml = '';
            weeklySchedule.forEach(item => {
                schedHtml += `
                    <div class="col">
                        <div class="p-3 schedule-card text-white h-100 d-flex flex-column justify-content-between">
                            <div>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-yellow fs-7">${item.day}</span>
                                    <small class="text-light schedule-time"><i class="fa-regular fa-clock me-1"></i>${item.time}</small>
                                </div>
                                <h3 class="h6 fw-bold text-white mb-2">${item.game}</h3>
                                <p class="small text-light mb-0 schedule-venue"><i class="fa-solid ${item.icon} text-yellow me-1"></i> ${item.venue}</p>
                            </div>
                            <div class="mt-3 pt-2 border-top border-secondary border-opacity-25 text-end">
                                <span class="text-yellow small fw-semibold schedule-status"><i class="fa-solid fa-signal me-1"></i>Open Lobby</span>
                            </div>
                        </div>
                    </div>
                `;
            });
            $('#weeklyScheduleContainer').html(schedHtml);


            // 3. RANKINGS MODULE LOGIC
            const rankingData = {
                hok: {
                    title: "Honor of Kings Division Standings",
                    teams: [
                        { rank: 1, name: "Harimau Malaya Kings", won: 6, winRate: "78%", points: 1450, icon: "fa-fire" },
                        { rank: 2, name: "Roti Canai Gankers", won: 4, winRate: "69%", points: 1120, icon: "fa-shield-cat" },
                        { rank: 3, name: "Boba Squad Kampar", won: 3, winRate: "61%", points: 940, icon: "fa-bolt" },
                        { rank: 4, name: "Sambal Belacan Esports", won: 2, winRate: "54%", points: 760, icon: "fa-crown" },
                        { rank: 5, name: "Kopitiam Roamers", won: 1, winRate: "48%", points: 590, icon: "fa-paw" }
                    ]
                },
                valorant: {
                    title: "Valorant Division Standings",
                    teams: [
                        { rank: 1, name: "Teh Tarik One-Tap", won: 8, winRate: "82%", points: 1800, icon: "fa-crosshairs" },
                        { rank: 2, name: "KL City Vipers", won: 5, winRate: "72%", points: 1350, icon: "fa-biohazard" },
                        { rank: 3, name: "Mamak Clutch Masters", won: 3, winRate: "64%", points: 1020, icon: "fa-skull" },
                        { rank: 4, name: "Nasi Lemak Rushers", won: 2, winRate: "55%", points: 810, icon: "fa-burst" },
                        { rank: 5, name: "Lepak ECO Squad", won: 1, winRate: "46%", points: 600, icon: "fa-shield-halved" }
                    ]
                },
                lol: {
                    title: "League of Legends Division Standings",
                    teams: [
                        { rank: 1, name: "Durian Musang Knights", won: 7, winRate: "79%", points: 1650, icon: "fa-dragon" },
                        { rank: 2, name: "Gopeng River Barons", won: 5, winRate: "70%", points: 1290, icon: "fa-gem" },
                        { rank: 3, name: "Milo Dinosaur Gaming", won: 4, winRate: "63%", points: 980, icon: "fa-music" },
                        { rank: 4, name: "Petaling Jaya Nexus", won: 2, winRate: "52%", points: 720, icon: "fa-bug" },
                        { rank: 5, name: "Padang Mid Gap", won: 1, winRate: "45%", points: 510, icon: "fa-wand-magic-sparkles" }
                    ]
                },
                dota2: {
                    title: "Dota 2 Division Standings",
                    teams: [
                        { rank: 1, name: "Kancil Turbo Esports", won: 9, winRate: "84%", points: 1950, icon: "fa-shield" },
                        { rank: 2, name: "Banjaran Rosh Slayers", won: 6, winRate: "74%", points: 1420, icon: "fa-hand-fist" },
                        { rank: 3, name: "Wira Ancient Defense", won: 3, winRate: "59%", points: 910, icon: "fa-landmark" },
                        { rank: 4, name: "Cendol Buyback Bois", won: 2, winRate: "51%", points: 700, icon: "fa-coins" },
                        { rank: 5, name: "Tapir Smoke Gang", won: 1, winRate: "47%", points: 530, icon: "fa-smog" }
                    ]
                },
                cs2: {
                    title: "Counter-Strike 2 Division Standings",
                    teams: [
                        { rank: 1, name: "Myvi High Beam UTAR", won: 7, winRate: "80%", points: 1720, icon: "fa-trophy" },
                        { rank: 2, name: "Jalan Loke Yew Defusers", won: 5, winRate: "68%", points: 1250, icon: "fa-wind" },
                        { rank: 3, name: "Onde-Onde AWP Unit", won: 4, winRate: "62%", points: 970, icon: "fa-stopwatch" },
                        { rank: 4, name: "Satay Rush B", won: 2, winRate: "50%", points: 680, icon: "fa-person-running" },
                        { rank: 5, name: "Pasar Malam Flashets", won: 1, winRate: "44%", points: 490, icon: "fa-sun" }
                    ]
                }
            };

            const FOLLOW_KEY = 'utar_followed_teams';

            function getFollowedTeams() {
                const s = localStorage.getItem(FOLLOW_KEY);
                return s ? JSON.parse(s) : [];
            }

            function setFollowedTeams(teams) {
                localStorage.setItem(FOLLOW_KEY, JSON.stringify(teams));
                updateFollowUI();
            }

            function updateFollowUI() {
                const followed = getFollowedTeams();
                $('#followedCountBadge').text(`${followed.length} Teams Followed`);

                $('.btn-star').each(function() {
                    const teamName = $(this).data('teamname');
                    if (followed.includes(teamName)) {
                        $(this).addClass('active').html('<i class="fa-solid fa-star"></i>');
                    } else {
                        $(this).removeClass('active').html('<i class="fa-regular fa-star"></i>');
                    }
                });
            }

            function renderRankings(gameKey) {
                const data = rankingData[gameKey];
                $('#currentTableTitle').text(data.title);

                let podiumHtml = '';
                const podiumClasses = ['first', 'second', 'third'];
                const podiumTrophyClasses = ['trophy-gold', 'trophy-silver', 'trophy-bronze'];

                data.teams.slice(0, 3).forEach((team, idx) => {
                    podiumHtml += `
                        <div class="col-md-4">
                            <div class="podium-card ${podiumClasses[idx]}">
                                <div class="mb-2"><i class="fa-solid fa-trophy fs-2 ${podiumTrophyClasses[idx]}"></i></div>
                                <span class="badge bg-secondary mb-2">Rank #${team.rank}</span>
                                <h3 class="h5 fw-bold text-white mb-1">${team.name}</h3>
                                <p class="text-yellow fw-bold mb-1"><i class="fa-solid fa-medal me-1"></i>${team.won} Tournaments Won</p>
                                <small class="text-light">${team.points} Circuit Points | ${team.winRate} Win Rate</small>
                            </div>
                        </div>
                    `;
                });
                $('#podiumContainer').html(podiumHtml);

                let tableHtml = '';
                const followed = getFollowedTeams();

                data.teams.forEach(team => {
                    let rankClass = 'rank-default';
                    if (team.rank === 1) rankClass = 'rank-1';
                    else if (team.rank === 2) rankClass = 'rank-2';
                    else if (team.rank === 3) rankClass = 'rank-3';

                    const isFav = followed.includes(team.name);

                    tableHtml += `
                        <tr>
                            <td class="text-center"><span class="rank-badge ${rankClass}">${team.rank}</span></td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="team-avatar me-3"><i class="fa-solid ${team.icon}"></i></div>
                                    <div><span class="fw-bold text-white d-block fs-6">${team.name}</span><small class="text-light opacity-75">Official UTAR Division Team</small></div>
                                </div>
                            </td>
                            <td class="text-center"><span class="badge bg-yellow px-3 py-2 fw-bold text-dark fs-6"><i class="fa-solid fa-trophy me-1"></i> ${team.won} Won</span></td>
                            <td class="text-center text-white fw-bold fs-6">${team.winRate}</td>
                            <td class="text-center text-yellow fw-bold fs-6">${team.points} pts</td>
                            <td class="text-center">
                                <button class="btn-star ${isFav ? 'active' : ''}" data-teamname="${team.name}" title="Follow Team"><i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-star"></i></button>
                            </td>
                        </tr>
                    `;
                });
                $('#rankingTableBody').html(tableHtml);
                updateFollowUI();
            }

            $('#gameTabs .nav-link').on('click', function() {
                $('#gameTabs .nav-link').removeClass('active');
                $(this).addClass('active');
                renderRankings($(this).data('game'));
            });

            $(document).on('click', '.btn-star', function() {
                const teamName = $(this).data('teamname');
                let followed = getFollowedTeams();
                followed = followed.includes(teamName) ? followed.filter(t => t !== teamName) : [...followed, teamName];
                setFollowedTeams(followed);
            });

            // 4. TOURNAMENTS LOGIC
            const TOURNEY_KEY = 'utar_esports_registered_tournaments';

            function getRegistrations() {
                const data = localStorage.getItem(TOURNEY_KEY);
                return data ? JSON.parse(data) : [];
            }

            function saveRegistration(item) {
                let regs = getRegistrations().filter(r => r.id !== item.id);
                regs.push(item);
                localStorage.setItem(TOURNEY_KEY, JSON.stringify(regs));
                updateTournamentsUI();
            }

            function updateTournamentsUI() {
                const regs = getRegistrations();
                $('#registeredCountBadge').text(`${regs.length} Registered`);

                $('.tourney-card').each(function() {
                    const tourneyId = $(this).data('tourney-id');
                    const isRegistered = regs.some(r => r.id === tourneyId);
                    const actionBtn = $(this).find('.tournament-action');

                    if (isRegistered) {
                        actionBtn
                            .removeClass('btn-register')
                            .addClass('btn-registered')
                            .html('<i class="fa-solid fa-check me-1"></i>Registered');
                    } else {
                        actionBtn
                            .removeClass('btn-registered')
                            .addClass('btn-register')
                            .text('Register Now');
                    }
                });
            }

            $(document).on('click', '.tournament-action', function() {
                const card = $(this).closest('.tourney-card');
                const id = card.data('tourney-id');

                if ($(this).hasClass('btn-registered')) {
                    cancelRegistration(id);
                    return;
                }

                openRegisterModal(
                    id,
                    card.find('h3').text(),
                    card.find('.tourney-meta-item:first').text().trim()
                );
            });

            $('#tourneyForm').on('submit', function(e) {
                e.preventDefault();
                const regData = {
                    id: $('#modalTourneyId').val(),
                    team: $('#teamName').val(),
                    captain: $('#captainName').val(),
                    studentId: $('#studentId').val(),
                    contact: $('#contactInfo').val(),
                    date: new Date().toLocaleDateString()
                };
                saveRegistration(regData);
                regModal.hide();
                alert(`Successfully registered ${regData.team}!`);
            });

            // 5. NEWS FILTER LOGIC
            $('.filter-btn').on('click', function() {
                $('.filter-btn').removeClass('active');
                $(this).addClass('active');
                const filter = $(this).data('filter');
                if (filter === 'all') $('.news-item').fadeIn(200);
                else {
                    $('.news-item').hide();
                    $(`.news-item[data-category="${filter}"]`).fadeIn(200);
                }
            });

            $('#newsSearch').on('keyup', function() {
                const keyword = $(this).val().toLowerCase();
                $('.news-item').each(function() {
                    const title = $(this).find('h3').text().toLowerCase();
                    const text = $(this).find('p').text().toLowerCase();
                    $(this).toggle(title.includes(keyword) || text.includes(keyword));
                });
            });

            $(document).on('click', '.news-details', function() {
                const card = $(this).closest('.news-card');
                showNewsDetails(card.find('h3').text(), $(this).data('date'), $(this).data('content'));
            });

            // Initial Renders
            updateGamesUI();
            renderRankings('hok');
            updateTournamentsUI();

            const requestedView = window.location.hash.slice(1);
            if (document.getElementById(requestedView)?.classList.contains('page-view')) {
                switchTab(requestedView);
            }
        });

        // Global Helpers
        function switchTab(viewId) {
            $('.page-view').removeClass('active-view');
            $(`#${viewId}`).addClass('active-view');
            $('.nav-switch').removeClass('active');
            $(`.nav-switch[data-target="${viewId}"]`).addClass('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function openRegisterModal(id, title, game) {
            $('#modalTourneyId').val(id);
            $('#modalTourneyTitle').text(`Register: ${title}`);
            $('#modalGameName').val(game);
            $('#tourneyForm')[0].reset();
            regModal.show();
        }

        function cancelRegistration(tourneyId) {
            if (confirm("Cancel team registration for this tournament?")) {
                let regs = JSON.parse(localStorage.getItem('utar_esports_registered_tournaments') || '[]').filter(r => r.id !== tourneyId);
                localStorage.setItem('utar_esports_registered_tournaments', JSON.stringify(regs));
                location.reload();
            }
        }

        function showNewsDetails(title, date, content) {
            $('#modalNewsTitle').text(title);
            $('#modalNewsDate').text(date);
            $('#modalNewsContent').text(content);
            newsModal.show();
        }
})();

