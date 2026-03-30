function MersenneTwister(seed) {
    this.mt = new Array(624);
    this.index = 0;

    // Initialization with the seed
    this.mt[0] = seed >>> 0;
    for (let i = 1; i < 624; i++) {
        this.mt[i] = (1812433253 * (this.mt[i - 1] ^ (this.mt[i - 1] >>> 30)) + i) >>> 0;
    }
}

// Generate a random number between 0 and 1
MersenneTwister.prototype.random = function() {
    if (this.index === 0) {
        this.generateNumbers();
    }

    let y = this.mt[this.index];
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9D2C5680;
    y ^= (y << 15) & 0xEFC60000;
    y ^= (y >>> 18);
    this.index = (this.index + 1) % 624;
    return y >>> 0 / 0xFFFFFFFF;
};

// Generate an array of 624 untempered numbers
MersenneTwister.prototype.generateNumbers = function() {
    for (let i = 0; i < 624; i++) {
        let y = (this.mt[i] & 0x80000000) | (this.mt[(i + 1) % 624] & 0x7FFFFFFF);
        this.mt[i] = this.mt[(i + 397) % 624] ^ (y >>> 1);
        if (y % 2 !== 0) {
            this.mt[i] ^= 0x9908B0DF;
        }
    }
};
