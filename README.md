# AI-Travel-Planner
软件旨在简化旅行规划过程，通过 AI 了解用户需求，自动生成详细的旅行路线和建议，并提供实时旅行辅助。
Web 版AI 旅行规划师 (AI Travel Planner)
一、说明：

软件旨在简化旅行规划过程，通过 AI 了解用户需求，自动生成详细的旅行路线和建议，并提供实时旅行辅助。

二、核心功能：

1、智能行程规划: 用户可以通过语音（或文字，语音功能一定要有）输入旅行目的地、日期、预算、同行人数、旅行偏好（例如：“我想去日本，5 天，预算 1 万元，喜欢美食和动漫，带孩子”），AI 会自动生成个性化的旅行路线，包括交通、住宿、景点、餐厅等详细信息。
2、费用预算与管理: 由 AI 进行预算分析，记录旅行开销（推荐可以使用语音）。
3、用户管理与数据存储:
注册登录系统: 用户可以保存和管理多份旅行计划。
云端行程同步: 旅行计划、偏好设置、费用记录等数据云端同步，方便多设备查看和修改。


三、技术栈（ Web）:
语音识别：基于科大讯飞语音识别 API 提供语音识别功能
地图导航：基于高德地图 API 提供地理位置服务和导航功能
数据库/认证： Supabase
行程规划和费用预算：通过阿里百炼平台大语言模型api完成形成规划和费用预算的估计
UI/UX： 地图为主的交互界面，清晰的行程展示，美观的图片。

四、注意事项

切记不要将任何 API key 写在代码中，尤其是 GitHub 上公开的代码库。建议在程序通过配置文件来指定 API Key。

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python (v3.8 or later)
- Pip

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/AI-Travel-Planner.git
   cd AI-Travel-Planner
   ```

2. **Backend Setup:**

   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Create a virtual environment:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
     ```
   - Install the required Python packages:
     ```bash
     pip install -r requirements.txt
     ```
   - Create a `.env` file in the `backend` directory and add the following environment variables. You will need to get these from your Supabase project and your Dashscope account.

     ```
     SUPABASE_URL=YOUR_SUPABASE_URL
     SUPABASE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
     DASHSCOPE_API_KEY=YOUR_DASHSCOPE_API_KEY
     ```

3. **Frontend Setup:**

   - Navigate to the `frontend` directory:
     ```bash
     cd ../frontend
     ```
   - Install the required npm packages:
     ```bash
     npm install
     ```
   - Create a `.env.local` file in the `frontend` directory and add the following environment variables. You will need to get these from your Supabase project.

     ```
     NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
     ```

### Running the Application

1. **Start the backend server:**

   - In the `backend` directory, run:
     ```bash
     uvicorn main:app --reload
     ```

2. **Start the frontend development server:**

   - In the `frontend` directory, run:
     ```bash
     npm run dev
     ```

Now, you can open your browser and navigate to `http://localhost:3000` to see the application in action.

## Security

**Important:** Never commit your `.env` or `.env.local` files to version control. They contain sensitive API keys and should be kept private. The provided `.gitignore` file should prevent this, but it's good practice to be aware of it.