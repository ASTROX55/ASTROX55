function setupLeaveRejoin(bot, createBot) {
    // This module no longer forces periodic disconnects.
    // Aternos/server-side disconnects are handled by index.js.
    let jumpTimer = null
    let jumpOffTimer = null
    let stopped = false

    function cleanup() {
        stopped = true
        if (jumpTimer) clearTimeout(jumpTimer)
        if (jumpOffTimer) clearTimeout(jumpOffTimer)
        jumpTimer = jumpOffTimer = null
    }

    function scheduleNextJump() {
        if (stopped || !bot || !bot.entity) return

        try {
            bot.setControlState('jump', true)
            jumpOffTimer = setTimeout(() => {
                try {
                    if (bot && bot.entity) bot.setControlState('jump', false)
                } catch (_) {}
            }, 300)

            // Random jump every 20s-5m; this does NOT disconnect/rejoin.
            const nextJump = Math.floor(Math.random() * (5 * 60 * 1000 - 20000 + 1)) + 20000
            jumpTimer = setTimeout(scheduleNextJump, nextJump)
        } catch (_) {}
    }

    bot.once('spawn', () => {
        stopped = false
        scheduleNextJump()
    })

    bot.on('end', cleanup)
    bot.on('kicked', cleanup)
    bot.on('error', () => {})
}

module.exports = setupLeaveRejoin
