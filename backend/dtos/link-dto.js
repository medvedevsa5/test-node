module.exports = class LinkDto {
    short;
    full;
    clickCount;
    expiresAt;
    constructor(model) {
        this.short = model.shortened;
        this.full = model.full;
        this.clickCount = model.clickCount;
        this.expiresAt = model.expiresAt;
    }
}