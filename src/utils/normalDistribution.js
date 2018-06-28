const normalDistribution = function normalDistributionFunc(mean, variance) {
    const state = {
        mean,
        variance,
        standardDeviation: Math.sqrt(variance)
    };

    function next() {
        const x0 = 1.0 - Math.random();
        const x1 = 1.0 - Math.random();
        
        return ((Math.sqrt(-2.0 * Math.log(x0)) * Math.cos(2.0 * Math.PI * x1)) * variance) + mean;
    }

    return Object.assign(state, {
        next
    });
};

export default normalDistribution;
