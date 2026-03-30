class DataLoader {
  constructor(filepath) {
    this.filepath = filepath;
    this.data = null;
  }

  loadData(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', this.filepath, true);

    xhr.onload = () => {
      if (xhr.status === 200) {
        // All the newlines
        this.data = xhr.responseText.split(/\r\n|\n|\r/).map(line => line.trim()).filter(line => line !== '');
        callback(null, this.data);
      } else {
        callback(`Failed to load data: ${xhr.status}`);
      }
    };

    xhr.onerror = () => {
      callback('An error occurred while trying to load the data.');
    };

    xhr.send();
  }

  getData() {
    return this.data;
  }
}

