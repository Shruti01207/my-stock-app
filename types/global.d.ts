import { SymbolTypes } from "@/lib/enums";

declare global {

    type ApiResponse<T> = {
        success: boolean,
        error?: string,
        data?: T
    }

    type SignInFormData = {
        email: string;
        password: string;
    };

    type SignUpFormData = {
        fullName: string;
        email: string;
        password: string;
        country: string;
        investmentGoals: string;
        riskTolerance: string;
        preferredIndustry: string;
    };

    type CountrySelectProps = {
        name: string;
        label: string;
        control: Control;
        error?: FieldError;
        required?: boolean;
    };

    type FormInputProps = {
        name: string;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    };

    type Option = {
        value: string;
        label: string;
        flag?: string;
    };

    type SelectFieldProps = {
        name: string;
        label: string;
        placeholder: string;
        options: readonly Option[];
        control: Control;
        error?: FieldError;
        required?: boolean;
    };

    type FooterLinkProps = {
        text: string;
        linkText: string;
        href: string;
    };

    type SearchCommandProps = {
        renderAs?: 'button' | 'text';
        label?: string;
        initialStocks: StockWithWatchlistStatus[];
    };

    type WelcomeEmailData = {
        email: string;
        name: string;
        intro: string;
    };

    type User = {
        id: string;
        name: string;
        email: string;
    };


    type StockWithWatchlistStatus = Stock & {
        isInWatchlist: boolean;
    };

    // type FinnhubSt = {
    //     symbol: string;
    //     description: string;
    //     displaySymbol?: string;
    //     type: string;
    // };

    type FinnhubSearchResponse = {
        count: number;
        result: Stock[];
    };

    type StockDetailsPageProps = {
        params: Promise<{
            symbol: string;
        }>;
    };

    type WatchlistButtonProps = {
        symbol: string;
        company: string;
        isInWatchlist: boolean;
        showTrashIcon?: boolean;
        type?: 'button' | 'icon';
        onWatchlistChange?: (symbol: string, isAdded: boolean) => void;
    };

    // type QuoteData = {
    //     c?: number;
    //     dp?: number;
    // };

    type ProfileData = {
        name?: string;
        marketCapitalization?: number;
    };

    type FinancialsData = {
        metric?: { [key: string]: number };
    };

    type SelectedStock = {
        symbol: string;
        company: string;
        currentPrice?: number;
    };

    type WatchlistTableProps = {
        watchlist: StockWithData[];
    };

    type StockWithData = {
        userId: string;
        symbol: string;
        company: string;
        addedAt: Date;
        currentPrice?: number;
        changePercent?: number;
        priceFormatted?: string;
        changeFormatted?: string;
        marketCap?: string;
        peRatio?: string;
    };



    type MarketNewsArticle = {
        id: number;
        headline: string;
        summary: string;
        source: string;
        url: string;
        datetime: number;
        category: string;
        related: string;
        image?: string;
        timeAgo: string
    };

    type WatchlistNewsProps = {
        news?: MarketNewsArticle[];
    };

    type SearchCommandProps = {
        open?: boolean;
        setOpen?: (open: boolean) => void;
        renderAs?: 'button' | 'text';
        buttonLabel?: string;
        buttonVariant?: 'primary' | 'secondary';
        className?: string;
    };

    type AlertData = {
        symbol: string;
        company: string;
        alertName: string;
        alertType: 'upper' | 'lower';
        threshold: string;
    };

    type AlertModalProps = {
        alertId?: string;
        alertData?: AlertData;
        action?: string;
        open: boolean;
        setOpen: (open: boolean) => void;
    };

    type RawNewsArticle = {
        id: number;
        headline?: string;
        summary?: string;
        source?: string;
        url?: string;
        datetime?: number;
        image?: string;
        category?: string;
        related?: string;
    };



    type Stock = {
        symbol: string,
        displaySymbol: string;
        description: string,
        type: string
    }

    type StockData = {
        symbol: string;
        price: number;
        change: number;
        high: number;
        low: number
    }

    type WatchListTableProps = {
        data: StockData[]
    }
    //   |->union type
    type StockSearchMode = "watchlist" | "navigate"

    type Trend = "up" | "down" | "flat"

    type CandleData = {
        close: string,
        datetime: string,
        high: string,
        low: string,
        open: string,
        volume: string
    }

    type PriceChartData = {
        time: number,
        close: number,
        low: number,
        high: number
    }

    type QuoteData = {
        average_volume: string;
        change: string;
        close: string;
        currency: string;
        datetime: string;
        exchange: string;
        fifty_two_week: any
        high: string;
        is_market_open: boolean;
        last_quote_at: number;
        low: string;
        mic_code: string;
        name: string;
        open: string;
        percent_change: string;
        previous_close: string;
        symbol: string;
        timestamp: number;
        volume: string
    }

    type CompanyProfile = {
        country: string;
        currency: string;
        estimateCurrency: string;
        exchange: string;
        finnhubIndustry: string;
        ipo: string;
        logo: string;
        marketCapitalization: number
        name: string;
        phone: string;
        shareOutstanding: number;
        ticker: string;
        weburl: string
    }


    type NewsSentiment = {
        title: string;
        url: string;
        time_published: string;
        authors: string[];
        summary: string;
        banner_image: string;
        source: string;
        category_within_source: string;
        source_domain: string;
        topics: any[];
        overall_sentiment_score: number;
        overall_sentiment_label: string;
        ticker_sentiment: any[];
        timeAgo: string
    }


    type NewsSentimentApiResponse = {
        feed: Array<NewsSentiment>;
        items: string;
        relevance_score_definition: string;
        sentiment_score_definition: string;
    }


    type SymbolDetails = {
        symbol: string;
        type: string | null
    }

    type MarketOverviewWidgetProps = {
        symbol: string;
        finHubSymbol: string
    }

    type Alert = {
        condition: 'above' | 'below' | "none"
        createdAt: string
        isActive: boolean
        symbol: string
        targetPrice?: number
        updatedAt: string
        _id: string
    }

    type AlertRequest = {
        symbol: string;
        targetPrice: number;
        condition: string;
        alertId?: string;

    }

    type SymbolInfo =
        {
            currency: string,
            description: string,
            displaySymbol: string,
            figi: string,
            figiComposite: string,
            isin: string,
            mic: string,
            shareClassFIGI: string,
            symbol: string,
            symbol2: string,
            type: string
        }

    type Condition = "above" | "below"

    type AlertForm = {
        targetPrice?: number;
        condition: "above" | "below" | "none";
        isConditionManual: boolean;
    }

    type EditAlertForm = {
        targetPrice?: number;
        condition: "above" | "below" | "none";
        isConditionManual: boolean;
        alertId: string
    }


    type MarketMoversData = {
        last_updated: string;
        metadata: string;
        most_actively_traded: Array<AlphaVantageTickData>,
        top_gainers: Array<AlphaVantageTickData>,
        top_losers: Array<AlphaVantageTickData>

    }


    type AlphaVantageTickData = {
        change_amount: string,
        change_percentage: string,
        price: string,
        ticker: string,
        volume: string
    }


}



export { };