class MissingEventDateModel {
  constructor(data) {
    const { id, includeText, excludeText, displayText, isDayBefore } = data;
    this.id = id;
    this.includeText = includeText;
    this.excludeText = excludeText;
    this.displayText = displayText;
    this.isDayBefore = isDayBefore;
  }
}

export default MissingEventDateModel;
