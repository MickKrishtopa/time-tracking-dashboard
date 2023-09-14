const getDashbordData = async (url = "./data.json") => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
};

class getDashbordItem {
    static PERIODS = {
        daily: "day",
        weekly: "week",
        monthly: "month",
    };

    constructor(data, container = ".content", view = "weekly") {
        this.data = data;
        this.container = document.querySelector(container);
        this.view = view;

        this._createMarkup();
    }

    _createMarkup() {
        const { title, timeframes } = this.data;
        const id = title.toLocaleLowerCase().replace(/ /g, "-");
        const { current, previous } = timeframes[this.view.toLocaleLowerCase()];

        this.container.insertAdjacentHTML(
            "beforeend",
            `
            <div class="activity activity_type_${id}">
                <div class="activity__content">
                    <div class="activity__title-area">
                        <h3 class="activity__titile">${title}</h3>
                        <span class="activity__details">...</span>
                    </div>
                    <p class="activity__count">${current} hrs</p>
                    <p class="activity__last-count">Last ${
                        getDashbordItem.PERIODS[this.view]
                    } - ${previous} hrs</p>
                </div>
            </div>`
        );
        this.time = this.container.querySelector(
            `.activity_type_${id} .activity__count`
        );
        this.prev = this.container.querySelector(
            `.activity_type_${id} .activity__last-count`
        );
    }

    changeView(view) {
        this.view = view.toLocaleLowerCase();
        const { current, previous } =
            this.data.timeframes[this.view.toLocaleLowerCase()];
        this.time.innerText = `${current} hrs`;
        this.prev.innerText = `Last ${
            getDashbordItem.PERIODS[this.view]
        } - ${previous} hrs`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    getDashbordData().then((data) => {
        const activitys = data.map((activity) => new getDashbordItem(activity));
        const intervals = document.querySelectorAll(".intervals__item");

        intervals.forEach((interval) => {
            interval.addEventListener("click", function () {
                intervals.forEach((inter) => {
                    inter.classList.remove("intervals__item_active");
                });
                interval.classList.add("intervals__item_active");
                console.log(interval.textContent);

                activitys.forEach((activity) => {
                    activity.changeView(interval.textContent.trim());
                });
            });
        });
    });
});
